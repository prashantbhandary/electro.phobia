import type { Metadata } from 'next'
import { getProjects } from '@/lib/server-api'
import ProjectsList from './ProjectsList'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Electronics Projects — PCBs, Robotics & Embedded Builds',
  description: 'Electronics projects built by the ElectroPhobia community: custom PCBs, micromouse robots, CubeSat modules and embedded games.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsList initialProjects={projects} />
}
