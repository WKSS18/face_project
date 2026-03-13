import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
@Controller('chat')
export class ChatController {
  private readonly apiKey: string;
  private readonly mailFrom?: string;
  private readonly smtpHost?: string;
  private readonly smtpPort?: number;
  private readonly smtpUser?: string;
  private readonly smtpPass?: string;
  constructor(private configService: ConfigService) {
    // 从环境变量读取 API Key
    this.apiKey = this.configService.get<string>('ZHIPU_API_KEY') || '';
    this.mailFrom = this.configService.get<string>('MAIL_FROM');
    this.smtpHost = this.configService.get<string>('SMTP_HOST');
    this.smtpPort = Number(this.configService.get<string>('SMTP_PORT') ?? 587);
    this.smtpUser = this.configService.get<string>('SMTP_USER');
    this.smtpPass = this.configService.get<string>('SMTP_PASS');
  }

  /**
   * 注入“当前日期时间”的 system 提示，帮助大模型感知今天是几号。
   * 统一使用北京时间，既有自然语言也有 ISO 字符串，便于模型解析。
   */
  private buildTodaySystemMessage(): { role: 'system'; content: string } {
    const now = new Date();
    const zhDate = now.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'long',
    });
    const iso = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }),
    ).toISOString();
    return {
      role: 'system',
      content: `今天的当前时间（北京时间）是：${zhDate}，对应 ISO 时间为：${iso}。当用户询问“今天几号”“现在是什么日期/年份/月份”等与当前日期时间相关的问题时，请以此为准回答，不要根据知识截止时间猜测。`,
    };
  }

  /**
   * 简单提取“XX天气”中的城市名称，支持中英文。
   */
  private extractCity(text: string): string | null {
    if (!text) return null;
    const normalized = text.trim();
    // 匹配 “北京天气”、“查询上海天气”、“weather in London”
    const zhMatch = normalized.match(/([\u4e00-\u9fa5A-Za-z\s]{1,30})天气/);
    if (zhMatch?.[1]) return zhMatch[1].trim();
    const enMatch = normalized.match(/weather\s+in\s+([A-Za-z\s]{1,30})/i);
    if (enMatch?.[1]) return enMatch[1].trim();
    return null;
  }

  /**
   * Open-Meteo 天气代码转中文描述
   */
  private mapWeatherCode(code: number): string {
    const map: Record<number, string> = {
      0: '晴朗',
      1: '大致晴朗',
      2: '多云',
      3: '阴',
      45: '有雾',
      48: '雾凇',
      51: '小毛毛雨',
      53: '中毛毛雨',
      55: '大毛毛雨',
      56: '小冻毛毛雨',
      57: '大冻毛毛雨',
      61: '小雨',
      63: '中雨',
      65: '大雨',
      66: '小冻雨',
      67: '大冻雨',
      71: '小雪',
      73: '中雪',
      75: '大雪',
      77: '雪粒',
      80: '小阵雨',
      81: '中阵雨',
      82: '暴阵雨',
      85: '小阵雪',
      86: '大阵雪',
      95: '雷暴',
      96: '雷暴伴轻微冰雹',
      99: '雷暴伴严重冰雹',
    };
    return map[code] ?? '未知天气';
  }

  /**
   * 调用 Open-Meteo 获取实时天气数据
   */
  private async fetchWeather(city: string): Promise<string | null> {
    const trimmed = city.trim();
    if (!trimmed) return null;

    // 优先使用 Open-Meteo（无鉴权、稳定），失败后再降级到 wttr.in
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmed,
        )}&count=1&language=zh&format=json`,
      );
      if (geoRes.ok) {
        const geoData = (await geoRes.json()) as any;
        const location = geoData?.results?.[0];
        if (location) {
          const { latitude, longitude, name, country, admin1 } = location;
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
          );
          if (weatherRes.ok) {
            const weatherData = (await weatherRes.json()) as any;
            const current = weatherData?.current;
            if (current) {
              const description = this.mapWeatherCode(current.weather_code);
              const locationText = [name, admin1, country].filter(Boolean).join(' / ');
              return `以下为实时天气数据（来自 Open-Meteo）：位置：${locationText}；时间：${current.time}；气温：${current.temperature_2m}°C；体感：${current.apparent_temperature}°C；湿度：${current.relative_humidity_2m}%；风速：${current.wind_speed_10m}m/s；天气状况：${description}。请结合用户问题，用简洁中文回答，并优先使用上述数据。`;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Open-Meteo 天气查询失败，尝试降级接口', err);
    }

    // 降级：wttr.in（同样免 Key，兼容更多地名）
    try {
      const wttrRes = await fetch(
        `https://wttr.in/${encodeURIComponent(trimmed)}?format=j1`,
      );
      if (!wttrRes.ok) return null;
      const data = (await wttrRes.json()) as any;
      const current = data?.current_condition?.[0];
      if (!current) return null;

      const nearestArea = data?.nearest_area?.[0];
      const locationText =
        nearestArea?.areaName?.[0]?.value ||
        nearestArea?.region?.[0]?.value ||
        nearestArea?.country?.[0]?.value ||
        trimmed;

      const time =
        current.localObsDateTime || current.observation_time || '';
      const desc = current.weatherDesc?.[0]?.value || '';

      return `以下为实时天气数据（来自 wttr.in）：位置：${locationText}；时间：${time}；气温：${current.temp_C}°C；体感：${current.FeelsLikeC}°C；湿度：${current.humidity}%；风速：${current.windspeedKmph}km/h；天气状况：${desc}。请结合用户问题，用简洁中文回答，并优先使用上述数据。`;
    } catch (err) {
      console.warn('wttr.in 天气查询失败', err);
      return null;
    }
  }

  /**
   * 提取股票/指数代码：
   * - 支持 “AAPL 股价”, "tsla price"
   * - 支持常见中文指数别名（沪深300、上证指数等）
   * - 支持直接输入 6 位 A 股代码
   */
  private extractStockSymbol(text: string): string | null {
    if (!text) return null;
    const normalized = text.trim();
    const lower = normalized.toLowerCase();

    // 常见中文指数/别名 → A 股指数代码（用于 Yahoo）
    if (
      normalized.includes('沪深300') ||
      normalized.includes('沪深 300') ||
      normalized.includes('沪深三百') ||
      lower.includes('csi300')
    ) {
      return '000300.SS';
    }
    if (normalized.includes('上证指数') || normalized.includes('上证综指') || normalized.includes('上证')) {
      return '000001.SS';
    }
    if (normalized.includes('深证成指') || normalized.includes('深成指') || normalized.includes('深证指数')) {
      return '399001.SZ';
    }
    if (normalized.includes('创业板指')) {
      return '399006.SZ';
    }

    // 直接出现 6 位 A 股代码
    const codeMatch = normalized.match(/\b(\d{6})\b/);
    if (codeMatch?.[1]) return codeMatch[1];

    // 英文股票代码（美股 / 港股等）
    // 为避免普通英文查询被误判为股票代码，这里要求上下文中必须明确提到
    // “股票 / 股价 / 行情 / stock / price”等关键词才会触发匹配
    const hasStockKeyword = /股票|股价|指数|行情|stock|stocks|share|shares|price|quote/i.test(
      normalized,
    );
    if (!hasStockKeyword) {
      return null;
    }

    // 兼容形如 “AAPL 股价”、“股票 TSLA”、“TSLA price” 等多种写法
    const tickerMatch =
      normalized.match(
        /(?:股票|股价|指数|行情|stock|stocks|share|shares|price|quote)\s*[:：]?\s*([A-Za-z][A-Za-z0-9.\-]{0,9})/i,
      ) ||
      normalized.match(
        /([A-Za-z][A-Za-z0-9.\-]{0,9})\s*(?:股票|股价|指数|行情|stock|stocks|share|shares|price|quote)/i,
      );
    if (tickerMatch?.[1]) return tickerMatch[1].toLowerCase();
    return null;
  }

  /**
   * 股票/指数行情查询：
   * - A 股及指数：走 Yahoo Finance
   * - 美股/港股等：走 stooq
   */
  private async fetchStock(symbol: string): Promise<string | null> {
    try {
      let normalized = symbol.trim();
      const lower = normalized.toLowerCase();

      // A 股/指数：6 位数字或显式 .SS / .SZ 结尾，走 Yahoo Finance
      const isSixDigit = /^\d{6}$/.test(normalized);
      const isCnSuffix = lower.endsWith('.ss') || lower.endsWith('.sz');

      if (isSixDigit || isCnSuffix) {
        const yahooSymbol = isCnSuffix
          ? lower.toUpperCase()
          : normalized.startsWith('6')
            ? `${normalized}.SS`
            : `${normalized}.SZ`;

        const resp = await fetch(
          `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yahooSymbol)}`,
        );
        if (!resp.ok) return null;
        const data = (await resp.json()) as any;
        const result = data?.quoteResponse?.result?.[0];
        if (!result) return null;

        return `以下为股票/指数报价（来源: Yahoo Finance，可能有延迟）：代码：${result.symbol}；名称：${result.shortName || result.longName || ''}；时间：${result.regularMarketTime || ''}；当前价：${result.regularMarketPrice}；涨跌：${result.regularMarketChange}（${result.regularMarketChangePercent}%）；今开：${result.regularMarketOpen}；最高：${result.regularMarketDayHigh}；最低：${result.regularMarketDayLow}；成交量：${result.regularMarketVolume}。请用简洁中文回答，并提示数据可能有延迟，仅供参考。`;
      }

      // 其他（默认按美股/港股等）走 Stooq
      const apiSymbol = lower.includes('.') ? lower : `${lower}.us`;
      const resp = await fetch(
        `https://stooq.pl/q/l/?s=${encodeURIComponent(apiSymbol)}&f=sd2t2ohlcv&h&e=json`,
      );
      if (!resp.ok) return null;
      const data = (await resp.json()) as any;
      const row = data?.[0] || data?.symbols?.[0];
      if (!row || row.close === 'N/D') return null;
      return `以下为股票行情（来源: stooq.pl，可能有延迟）：代码：${row.symbol}；日期：${row.date} ${row.time || ''}；开盘：${row.open}；最高：${row.high}；最低：${row.low}；收盘：${row.close}；成交量：${row.volume}。请简洁回答并提示数据为延迟行情，仅供参考。`;
    } catch (err) {
      console.warn('股票查询失败', err);
      return null;
    }
  }

  /**
   * 发送邮件，将工具结果邮件通知用户
   */
  private async sendEmail(to: string, subject: string, text: string) {
    if (!this.smtpHost || !this.smtpUser || !this.smtpPass || !this.mailFrom) {
      console.warn('SMTP 未配置，跳过发信');
      return;
    }
    const transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort || 587,
      secure: (this.smtpPort || 587) === 465,
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });
    await transporter.sendMail({
      from: this.mailFrom,
      to,
      subject,
      text,
    });
  }

  /**
   * 统一设置 SSE 响应头
   */
  private setupSseHeaders(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    (res as any).socket?.setNoDelay?.(true);
  }

  /**
   * 统一转发到智谱流式接口
   */
  private async forwardBigModelStream(options: {
    res: Response;
    body: any;
    messages: any[];
    model: string;
  }) {
    const { res, body, messages, model } = options;
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        ...body,
        messages,
        stream: true,
        model,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      res.write(`data: ${JSON.stringify({ error: errorText })}\n\n`);
      res.end();
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      res.end();
      return;
    }
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        res.write('data: [DONE]\n\n');
        break;
      }
      const chunk = Buffer.from(value).toString('utf-8');
      res.write(chunk);
    }
    res.end();
  }

  /**
   * 简单的工具规划：判断是否需要调用天气/股票工具
   */
  private async decideTool(
    messages: any[],
    model: string,
  ): Promise<
    | { tool: 'weather'; city: string }
    | { tool: 'stock'; symbol: string }
    | { tool: 'none' }
  > {
    try {
      const lastUser = [...messages].reverse().find((m) => m?.role === 'user');
      const userContent = lastUser?.content ? String(lastUser.content) : '';
      const cityByRule = this.extractCity(userContent);
      if (cityByRule) {
        return { tool: 'weather', city: cityByRule };
      }
      const stockByRule = this.extractStockSymbol(userContent);
      if (stockByRule) {
        return { tool: 'stock', symbol: stockByRule };
      }

      const toolHintSystem = {
        role: 'system',
        content:
          '你是工具选择器。只回复 JSON，不要多余文字。可用工具: weather(city), stock(symbol)。当用户询问天气或气候，用 weather；当用户询问股价/股票行情，用 stock。' +
          'stock 的 symbol 可以是：美股代码（如 AAPL、TSLA）、港股代码（如 0700.HK）、A 股 6 位代码（如 600519、000001），或带交易所后缀的指数代码（如 000300.SS、399001.SZ）。' +
          '只有当用户问题中明确提到“股票、股价、指数、行情、stock、price”等与行情相关的词时，才考虑使用 stock；否则不要调用股票工具。' +
          '如果无法判断或缺少城市/代码，返回 {"tool":"none"}.',
      };
      const planner = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [toolHintSystem, ...messages.slice(-4)], // 只取最后几轮，降低token
          temperature: 0,
        }),
      });
      if (!planner.ok) return { tool: 'none' };
      const planJson = (await planner.json()) as any;
      const content: string = planJson?.choices?.[0]?.message?.content ?? '';
      const parsed = JSON.parse(content);
      if (parsed?.tool === 'weather' && typeof parsed?.city === 'string' && parsed.city.trim()) {
        return { tool: 'weather', city: parsed.city.trim() };
      }
      if (parsed?.tool === 'stock' && typeof parsed?.symbol === 'string' && parsed.symbol.trim()) {
        // 二次防护：即便规划器返回了 stock，也只有在用户内容中明确出现与股票相关的关键词时才真正调用
        const hasStockKeyword =
          /股票|股价|指数|行情|stock|stocks|share|shares|price|quote/i.test(userContent);
        if (!hasStockKeyword) {
          return { tool: 'none' };
        }
        return { tool: 'stock', symbol: parsed.symbol.trim().toLowerCase() };
      }
      return { tool: 'none' };
    } catch (err) {
      console.warn('工具规划失败', err);
      return { tool: 'none' };
    }
  }

  @Post('stream')
  async stream(@Body() body: any, @Res() res: Response) {
    this.setupSseHeaders(res);
    try {
      const incomingMessages = Array.isArray(body?.messages) ? body.messages : [];
      let finalMessages = [this.buildTodaySystemMessage(), ...incomingMessages];

      // 如果用户请求天气，追加实时天气的 system 提示
      const lastUser = [...incomingMessages].reverse().find((m) => m?.role === 'user');
      const city = lastUser?.content ? this.extractCity(String(lastUser.content)) : null;
      if (city) {
        const weatherPrompt = await this.fetchWeather(city);
        if (weatherPrompt) {
          finalMessages = [
            this.buildTodaySystemMessage(),
            ...incomingMessages,
            {
              role: 'system',
              content: weatherPrompt,
            },
          ];
        }
      }

      const model = body.model || 'glm-4.7';
      await this.forwardBigModelStream({
        res,
        body,
        messages: finalMessages,
        model,
      });
    } catch (error) {
      console.error('Stream Error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Server Internal Error' })}\n\n`);
      res.end();
    }
  }

  /**
   * Agent 模式：先规划工具，再流式回答
   */
  @Post('agent-stream')
  async agentStream(@Body() body: any, @Res() res: Response) {
    this.setupSseHeaders(res);
    try {
      const incomingMessages = Array.isArray(body?.messages) ? body.messages : [];
      let finalMessages = [this.buildTodaySystemMessage(), ...incomingMessages];
      const model = body.model || 'glm-4.7';
      const emailTo: string | undefined =
        typeof body.email === 'string' && body.email.includes('@') ? body.email.trim() : undefined;
      let toolResult: string | null = null;

      // 1) 工具规划
      const decision = await this.decideTool(incomingMessages, model);
      if (decision.tool === 'weather') {
        toolResult = await this.fetchWeather(decision.city);
      } else if (decision.tool === 'stock') {
        toolResult = await this.fetchStock(decision.symbol);
      }
      if (toolResult) {
        finalMessages = [
          ...incomingMessages,
          { role: 'system', content: `工具调用结果：${toolResult}` },
        ];
        if (emailTo) {
          this.sendEmail(emailTo, 'AI Agent 工具结果', toolResult).catch((err) =>
            console.warn('发送邮件失败', err),
          );
        }
      }

      // 2) 继续走原有流式对话
      await this.forwardBigModelStream({
        res,
        body,
        messages: finalMessages,
        model,
      });
    } catch (error) {
      console.error('Agent Stream Error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Server Internal Error' })}\n\n`);
      res.end();
    }
  }
}