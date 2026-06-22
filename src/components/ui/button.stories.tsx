import { Button } from './button'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'secondary', 'outline', 'ghost', 'danger', 'success'] },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Default Button' },
}

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

export const Success: Story = {
  args: { variant: 'success', children: 'Approve' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
}

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Large Button' },
}
