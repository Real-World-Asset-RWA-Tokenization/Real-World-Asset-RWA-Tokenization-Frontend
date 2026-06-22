import { Badge } from './badge'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger', 'outline'] },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { children: 'Default' },
}

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Failed' },
}

export const Primary: Story = {
  args: { variant: 'primary', children: 'New' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Draft' },
}
