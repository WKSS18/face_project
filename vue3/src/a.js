function replaceImgSrcWithTempUrls(htmlContent, cloudImageUrls, fileList) {
  // 构建一个映射，将 cloudUrl 映射到 tempFileURL
  const urlMap = {};
  cloudImageUrls.forEach((cloudUrl, index) => {
    if (fileList[index] && fileList[index].tempFileURL) {
      urlMap[cloudUrl] = fileList[index].tempFileURL;
    }
  });

  // 使用正则表达式匹配所有 img 标签
  const imgRegex = /<img\s+[^>]*data-custom="url=([^\"]+)"[^>]*src="([^\"]+)"[^>]*>/gi;

  // 替换 img 标签中的 src 属性
  const replacedHtml = htmlContent.replace(imgRegex, (match, dataCustomUrl, oldSrc) => {
    if (urlMap[dataCustomUrl]) {
      // 如果找到了对应的 tempFileURL，则替换 src 属性
      return match.replace(oldSrc, urlMap[
      dataCustomUrl]); // 或者更准确的方式：重新构建 img 标签字符串，因为直接替换可能不准确（如果有多个 src 属性等）
      // 更准确的方式：
      // return `<img ${ /* 提取并保留其他属性 */ match的某部分（排除原src） } src="${urlMap[dataCustomUrl]}" ...>`;
      // 但由于正则表达式捕获了其他部分，我们可以重新构建：
      // 简化处理：假设正则表达式匹配的整个标签中，我们只需要替换 src 的值
      // 由于我们捕获了 data-custom 和原 src，我们可以这样构建新的标签：
      // 注意：这里我们假设标签内没有其它重要的动态属性变化，且格式固定
      // 更好的方式是使用 DOMParser，但这里我们使用字符串操作
      const otherAttrs = match.substring(0, match.indexOf('src="') - 1).replace(/src="[^"]*"/,
        '').trim(); // 这其实不完美，因为可能有多个空格或属性顺序不同
      // 更简单且更健壮的方式：不尝试解析属性，而是直接替换整个 src 属性部分（如果确定格式）
      // 或者，我们可以捕获整个标签除了 src 的部分，但这里为了简化，我们采用直接字符串替换（可能不完美）
      // 由于我们已经知道新的 src 值，我们可以直接替换整个原 src 属性部分：
      return match.replace(/src="[^"]*"/, `src="${urlMap[dataCustomUrl]}"`);
    }
    // 如果没有找到对应的 tempFileURL，则返回原始标签
    return match;
  });

  // 更健壮的正则表达式替换方式（不依赖于内部属性顺序）：
  // 我们重新设计替换函数，不基于捕获的 oldSrc 进行字符串替换，而是基于捕获的整个标签和 data-custom URL
  // 但由于上面的 replace 已经用了函数，我们可以直接在里面构建新的标签字符串
  // 实际上，上面的替换已经足够简单，且如果标签格式固定，可能是可行的
  // 但为了更健壮，我们可以这样做：
  // 重新构建 img 标签，保留所有其他属性，只替换 src
  // 这需要解析属性，但我们可以简化处理，因为我们已经知道 data-custom 和要设置的 src
  // 我们可以这样做：提取标签中的所有属性，然后替换或添加 src 属性
  // 但由于这比较复杂，且你的需求可能不要求完美处理所有 HTML 情况，我们采用上面的简单替换

  // 然而，上面的简单替换可能有问题，如果标签中有多个 src 属性（虽然这不应该发生），或者如果 src 属性不在我们预期的位置
  // 因此，我提供一个更健壮的版本，它重新构建整个 img 标签，但保留所有其他属性
  // 但为了简洁，我们不在这里实现，因为上面的简单替换在大多数情况下可能足够

  // 返回替换后的 HTML 内容
  return replacedHtml;
  // 或者，我们可以直接在上面的 replace 函数中构建并返回新的标签字符串（如上面注释所示），而不做额外的字符串替换
  // 下面是一个更健壮的构建方式（在 replace 函数中）：
  // 假设我们的正则表达式捕获了 data-custom 之前的所有内容（不包括 data-custom 本身）和 data-custom 的值（我们不需要单独捕获 data-custom 的其余部分）
  // 但为了简化，我们采用一个不同的正则表达式，它捕获整个标签的开头到 data-custom，以及 data-custom 的值，和 src 的值，以及标签的其余部分
  // 这可能变得复杂，因此我将提供一个简化的解决方案，它仅当 data-custom 和 src 相邻时才工作（如之前的正则表达式）
  // 或者，我们可以使用一个更简单的正则表达式来匹配整个标签，并在替换函数中解析属性（使用另一个正则表达式或字符串操作）
  // 由于这很复杂，我们回到最初的简单替换，但修改为只替换第一个 src 属性（如果存在多个，则可能不正确）
  // 或者，我们可以假设每个 img 标签只有一个 src 属性，这是标准做法

  // 鉴于上述复杂性，我将提供一个修正后的简单替换，它只替换第一个匹配的 src 属性值
  // 但由于我们的正则表达式是全局的，并且我们为每个 img 标签调用一次替换函数，所以这是可行的
  // 在替换函数中，我们只需要替换第一个出现的 src 属性值（即我们捕获的那个）
  // 但我们的替换字符串 `src="${urlMap[dataCustomUrl]}"` 只会替换第一个匹配的 src 属性（因为 replace 的第一个参数是正则表达式，且我们没有使用全局标志 in this replace call（在这个替换函数的内部 replace 调用中，我们实际上是在替换一个字符串，而不是正则表达式匹配的多个部分））
  // 所以，上面的 `match.replace(/src="[^"]*"/, ...)` 是安全的，因为它只会替换第一个 src 属性
  // 因此，我们保留这个替换方式
}

// 更简洁且健壮的实现（避免内部 replace 的复杂性）：
function replaceImgSrcWithTempUrls_Robust(htmlContent, cloudImageUrls, fileList) {
  const urlMap = {};
  cloudImageUrls.forEach((cloudUrl, index) => {
    if (fileList[index] && fileList[index].tempFileURL) {
      urlMap[cloudUrl] = fileList[index].tempFileURL;
    }
  });

  // 使用正则表达式匹配 img 标签，并捕获整个标签以及 data-custom URL
  // 这个正则表达式可能很复杂，因为我们需要保留所有属性
  // 我们可以捕获整个标签，然后在替换函数中解析它，但为了简化，我们使用一个简单的正则表达式来定位 data-custom 和 src
  // 下面是一个更简单的方案：首先提取所有 img 标签，然后逐个处理
  // 但由于我们想要一个单一的 replace 调用，我们采用以下方式：
  const imgRegex = /<img\b([\s\S]*?)>/gi; // 非贪婪匹配整个 img 标签
  // 但这个正则表达式会匹配任何 img 标签，不管它是否有 data-custom 属性
  // 我们可以先测试是否有 data-custom 属性，然后再处理，但为了简化，我们在替换函数中处理
  return htmlContent.replace(imgRegex, function (match) {
    // 检查这个 img 标签是否有 data-custom 属性，并且其值在 urlMap 中
    const dataCustomRegex = /data-custom="url=([^\"]+)"/;
    const dataCustomMatch = match.match(dataCustomRegex);
    if (dataCustomMatch && urlMap[dataCustomMatch[1]]) {
      // 替换 src 属性
      const srcRegex = /src="([^"]*)"/;
      const srcMatch = match.match(srcRegex);
      if (srcMatch) { // 实际上，我们想要替换，所以即使没有 src 也应该保留标签，但通常 img 都有 src
        // 替换 src 的值
        return match.replace(srcRegex, `src="${urlMap[dataCustomMatch[1]]}"`);
      }
    }
    // 如果没有匹配的 data-custom 或没有对应的 tempFileURL，或者没有 src 属性，则返回原始标签
    return match;
  });
}

// 使用示例：
const htmlContent = `...`; // 你的 HTML 字符串
const cloudImageUrls = [
  "cloud://url1.png",
  "cloud://url2.png"
];
const fileList = [{
    tempFileURL: "https://example.com/temp1.png"
  },
  {
    tempFileURL: "https://example.com/temp2.png"
  }
];

console.log(replaceImgSrcWithTempUrls_Robust(htmlContent, cloudImageUrls, fileList));
