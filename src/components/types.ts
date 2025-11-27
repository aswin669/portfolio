export interface Project {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  image?: string;
}

export interface Skill {
  id: string;
  title: string;
  percent: number;
  icon?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}