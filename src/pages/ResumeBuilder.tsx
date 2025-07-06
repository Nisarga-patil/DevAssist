import { useState } from 'react';
import { Download, Eye, Plus, Trash2, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import { ResumeData, PersonalInfo, Education, Experience, Project, Skills } from '../types';
import jsPDF from 'jspdf';

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    id: '1',
    userId: '1',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: [],
      databases: []
    },
    template: 'modern',
    lastUpdated: new Date()
  });

  const [activeSection, setActiveSection] = useState<'personal' | 'education' | 'experience' | 'projects' | 'skills'>('personal');
  const [showPreview, setShowPreview] = useState(false);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      startDate: '',
      endDate: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const updateSkills = (category: keyof Skills, value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: skills }
    }));
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(resumeData.personalInfo.fullName, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const contactInfo = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location
    ].filter(Boolean).join(' | ');
    
    pdf.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
    
    if (resumeData.personalInfo.linkedin || resumeData.personalInfo.github) {
      yPosition += 5;
      const links = [
        resumeData.personalInfo.linkedin,
        resumeData.personalInfo.github,
        resumeData.personalInfo.portfolio
      ].filter(Boolean).join(' | ');
      pdf.text(links, pageWidth / 2, yPosition, { align: 'center' });
    }

    yPosition += 15;

    // Skills
    if (resumeData.skills.languages.length > 0 || resumeData.skills.frameworks.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TECHNICAL SKILLS', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      if (resumeData.skills.languages.length > 0) {
        pdf.text(`Languages: ${resumeData.skills.languages.join(', ')}`, 20, yPosition);
        yPosition += 5;
      }
      
      if (resumeData.skills.frameworks.length > 0) {
        pdf.text(`Frameworks: ${resumeData.skills.frameworks.join(', ')}`, 20, yPosition);
        yPosition += 5;
      }
      
      if (resumeData.skills.tools.length > 0) {
        pdf.text(`Tools: ${resumeData.skills.tools.join(', ')}`, 20, yPosition);
        yPosition += 5;
      }
      
      if (resumeData.skills.databases.length > 0) {
        pdf.text(`Databases: ${resumeData.skills.databases.join(', ')}`, 20, yPosition);
        yPosition += 5;
      }
      
      yPosition += 5;
    }

    // Experience
    if (resumeData.experience.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EXPERIENCE', 20, yPosition);
      yPosition += 8;
      
      resumeData.experience.forEach(exp => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.position, 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${exp.company} | ${exp.startDate} - ${exp.endDate}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 5;
        
        const descriptionLines = pdf.splitTextToSize(exp.description, pageWidth - 40);
        pdf.text(descriptionLines, 20, yPosition);
        yPosition += descriptionLines.length * 4 + 5;
      });
      
      yPosition += 5;
    }

    // Projects
    if (resumeData.projects.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJECTS', 20, yPosition);
      yPosition += 8;
      
      resumeData.projects.forEach(project => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.name, 20, yPosition);
        yPosition += 5;
        
        pdf.setFont('helvetica', 'normal');
        const descriptionLines = pdf.splitTextToSize(project.description, pageWidth - 40);
        pdf.text(descriptionLines, 20, yPosition);
        yPosition += descriptionLines.length * 4;
        
        if (project.technologies.length > 0) {
          pdf.text(`Technologies: ${project.technologies.join(', ')}`, 20, yPosition);
          yPosition += 5;
        }
        
        yPosition += 3;
      });
      
      yPosition += 5;
    }

    // Education
    if (resumeData.education.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EDUCATION', 20, yPosition);
      yPosition += 8;
      
      resumeData.education.forEach(edu => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${edu.degree} in ${edu.field}`, 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 5;
        
        if (edu.gpa) {
          pdf.text(`GPA: ${edu.gpa}`, 20, yPosition);
          yPosition += 5;
        }
        
        yPosition += 3;
      });
    }

    pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: Code },
    { id: 'skills', name: 'Skills', icon: Code }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a professional resume with our easy-to-use builder
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-secondary btn-md flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
          </button>
          <button
            onClick={generatePDF}
            className="btn btn-primary btn-md flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            {activeSection === 'personal' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input w-full"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="input w-full"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      className="input w-full"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      className="input w-full"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
                  <button
                    onClick={addEducation}
                    className="btn btn-primary btn-sm flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education Entry</h3>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            GPA (optional)
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            placeholder="e.g., Sept 2020"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            placeholder="e.g., May 2024"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.education.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No education entries yet. Click "Add Education" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                  <button
                    onClick={addExperience}
                    className="btn btn-primary btn-sm flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Experience Entry</h3>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              className="input w-full"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Position
                            </label>
                            <input
                              type="text"
                              className="input w-full"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Start Date
                            </label>
                            <input
                              type="text"
                              className="input w-full"
                              placeholder="e.g., Jan 2023"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="text"
                              className="input w-full"
                              placeholder="e.g., Present"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Description
                          </label>
                          <textarea
                            className="input w-full h-24 resize-none"
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Technologies Used (comma separated)
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={exp.technologies?.join(', ') || ''}
                            onChange={(e) => updateExperience(exp.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                            placeholder="React, Node.js, MongoDB, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.experience.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No experience entries yet. Click "Add Experience" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
                  <button
                    onClick={addProject}
                    className="btn btn-primary btn-sm flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resumeData.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Entry</h3>
                        <button
                          onClick={() => removeProject(project.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Project Name
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            className="input w-full h-20 resize-none"
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            placeholder="Describe what the project does and your role..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Technologies (comma separated)
                          </label>
                          <input
                            type="text"
                            className="input w-full"
                            value={project.technologies.join(', ')}
                            onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                            placeholder="React, Express, PostgreSQL, etc."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              GitHub URL (optional)
                            </label>
                            <input
                              type="url"
                              className="input w-full"
                              value={project.githubUrl}
                              onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Live URL (optional)
                            </label>
                            <input
                              type="url"
                              className="input w-full"
                              value={project.liveUrl}
                              onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No projects yet. Click "Add Project" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Technical Skills</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Programming Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={resumeData.skills.languages.join(', ')}
                      onChange={(e) => updateSkills('languages', e.target.value)}
                      placeholder="JavaScript, Python, Java, C++, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frameworks & Libraries (comma separated)
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={resumeData.skills.frameworks.join(', ')}
                      onChange={(e) => updateSkills('frameworks', e.target.value)}
                      placeholder="React, Node.js, Express, Django, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tools & Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={resumeData.skills.tools.join(', ')}
                      onChange={(e) => updateSkills('tools', e.target.value)}
                      placeholder="Git, Docker, AWS, Kubernetes, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Databases (comma separated)
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={resumeData.skills.databases.join(', ')}
                      onChange={(e) => updateSkills('databases', e.target.value)}
                      placeholder="MySQL, PostgreSQL, MongoDB, Redis, etc."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}