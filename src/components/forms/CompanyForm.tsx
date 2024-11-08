import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Company } from '@/lib/types'

const EXPERTISE_OPTIONS = [
  'Infrastructure',
  'Transportation',
  'Energy',
  'Technology',
  'Environmental',
  'Healthcare'
]

export function CompanyForm({
  onSubmit
}: {
  onSubmit: (company: Company) => void
}) {
  const [company, setCompany] = useState<Partial<Company>>({
    expertise: []
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(company as Company)
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <Input
          required
          placeholder="e.g., SG Infrastructure Pte Ltd"
          onChange={(e) => setCompany({ ...company, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          required
          placeholder="Tell us about your company..."
          onChange={(e) => setCompany({ ...company, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expertise</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERTISE_OPTIONS.map(exp => (
            <label key={exp} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={company.expertise?.includes(exp)}
                onChange={(e) => {
                  const expertise = e.target.checked
                    ? [...(company.expertise || []), exp]
                    : (company.expertise || []).filter(x => x !== exp)
                  setCompany({ ...company, expertise })
                }}
              />
              <span>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Years of Experience</label>
        <Input
          type="number"
          required
          min={0}
          max={100}
          onChange={(e) => setCompany({ ...company, yearsOfExperience: parseInt(e.target.value) })}
        />
      </div>

      <Button type="submit">Create Company</Button>
    </form>
  )
}