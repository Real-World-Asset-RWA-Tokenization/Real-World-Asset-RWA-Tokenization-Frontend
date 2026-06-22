import { Card, CardHeader, CardTitle, CardContent } from './card'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">This is card content with some description text.</p>
      </CardContent>
    </Card>
  ),
}
