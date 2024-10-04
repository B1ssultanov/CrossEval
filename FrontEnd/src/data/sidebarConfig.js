// data/sidebarConfig.js
//This is to manage the list of buttons and allowed functions for student/teacher roles. Will be used at every sidebar in every desktop page.

export const studentSidebarItems = [
    { label: 'Home page', icon: 'home', href: '/' },
    { label: 'Schedule', icon: 'schedule', href: '/schedule' },
    { label: 'Tasks', icon: 'tasks', href: '/tasks' },
    { label: 'Grades', icon: 'grades', href: '/grades' },
  ];
  
  export const teacherSidebarItems = [
    { label: 'Home page', icon: 'home', href: '/' },
    { label: 'Schedule', icon: 'schedule', href: '/schedule' },
    { label: 'Create course', icon: 'plus', href: '/create-course' },
  ];
  
  
  