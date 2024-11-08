import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem
} from '@mui/material';

interface ContractSubmissionProps {
  onSubmit: (contractData: {
    title: string;
    description: string;
    baseValue: number;
    risks: string[];
    sustainability: number;
  }) => void;
}

const SINGAPORE_INFRASTRUCTURE_CATEGORIES = [
  'Public Housing Development',
  'Transportation Infrastructure',
  'Green Energy Project',
  'Urban Redevelopment',
  'Smart City Initiative'
];

const RISK_CATEGORIES = [
  'Environmental Impact',
  'Budget Overrun',
  'Technical Complexity',
  'Regulatory Challenges',
  'Supply Chain Disruption'
];

export const ContractSubmissionForm: React.FC<ContractSubmissionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    baseValue: 0,
    category: '',
    risks: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sustainability: Math.floor(Math.random() * 100), // Random sustainability score
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        name="title"
        label="Contract Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <TextField
        name="description"
        label="Project Description"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
        required
      />
      <TextField
        name="baseValue"
        label="Base Contract Value (SGD)"
        type="number"
        value={formData.baseValue}
        onChange={handleChange}
        required
      />
      <FormControl>
        <InputLabel>Infrastructure Category</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange as any}
          required
        >
          {SINGAPORE_INFRASTRUCTURE_CATEGORIES.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Potential Risks</InputLabel>
        <Select
          multiple
          name="risks"
          value={formData.risks}
          onChange={handleChange as any}
        >
          {RISK_CATEGORIES.map(risk => (
            <MenuItem key={risk} value={risk}>
              {risk}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit Contract
      </Button>
    </Box>
  );
};