import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src/Button'

const meta: Meta<typeof Button> = {
  title: '组件/Button 按钮',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: '视觉变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '尺寸',
    },
    block: { control: 'boolean', description: '是否块级' },
    loading: { control: 'boolean', description: '加载状态' },
    disabled: { control: 'boolean', description: '是否禁用' },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: '主要按钮',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: '次要按钮',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: '描边按钮',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: '幽灵按钮',
    variant: 'ghost',
  },
}

export const Danger: Story = {
  args: {
    children: '危险按钮',
    variant: 'danger',
  },
}

export const Small: Story = {
  args: {
    children: '小号',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: '大号',
    size: 'lg',
  },
}

export const Block: Story = {
  args: {
    children: '块级按钮',
    block: true,
  },
}

export const Loading: Story = {
  args: {
    children: '加载中',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: '禁用',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}
