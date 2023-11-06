module.exports = {
  // pathPrefix: '/gatsby-theme-academic',
  siteUrl: 'https://rogerdtz.github.io',
  title: 'Tingzhen Dong',
  description: 'Personal Website of Tingzhen Dong',
  author: 'Tingzhen Dong',
  authorAlternative: '董廷臻 (Roger)',
  introduction: [
    'I am currently an undergraduate student majoring Computer Science & Technology at Southern University of Science and Technology ([SUSTech](https://sustech.edu.cn/)), advised by Prof. [Yinqian Zhang](https://yinqian.org/). In 2023, I had a 6-month internship at Massachusetts Institute of Technology ([MIT](https://www.mit.edu/)) working with Prof. [Mengjia Yan](https://people.csail.mit.edu/mengjia/).',
    'My major research interests are **computer architecture, operating systems, and cloud computing**, with a focus on their security aspects.',
    'I am applying for Ph.D. programs for 2024 Fall. Please contact me if you are looking for new students!'
  ],
  avatar: 'avatar.png',
  professions: [
    'CS Student',
  ],
  tocMaxDepth: 2,
  excerptMaxLength: 500,
  // birthday: 'Some day',
  location: 'Shenzhen, China',
  email: 'dtzroger@gmail.com',
  postsForArchivePage: 3,
  defaultLanguage: 'en',
  disqusScript: process.env.DISQUS_SCRIPT
    || 'https://tc-imba.disqus.com/embed.js',
  pages: {
    home: '/',
    posts: 'posts',
    contact: 'contact',
    resume: 'resume',
    tags: 'tags',
    research: 'research',
  },
  social: [
    {
      url: '/CV - Tingzhen Dong.pdf',
      icon: ['ai', 'cv'],
    }, {
      url: 'https://github.com/RogerDTZ',
      icon: ['fab', 'github'],
    },
  ],
  // facebook: 'https://www.facebook.com/rolwin.monteiro',
  // instagram: 'https://www.instagram.com/reevan100/',
  // rss: '/rss.xml',
  // wakatime: {
  //   username: 'tcimba',
  //   activity: '7add4047-08f9-4da8-b649-aa114503678f',
  //   language: '460a84ab-722a-4b80-b896-cabaa13ad7eb',
  //   editor: 'd851639a-28d8-4884-949f-d338a858f7e9',
  //   os: 'caf7d0d1-8fd2-4595-a991-363c8583fea9',
  // },
  // contactFormUrl: process.env.CONTACT_FORM_ENDPOINT
  //   || 'https://getform.io/f/09a3066f-c638-40db-ad59-05e4ed71e451',
  googleAnalyticTrackingId: process.env.GA_TRACKING_ID || '',
  education: [
    {
      date: 'Mar 2023 - Aug 2023',
      icon: 'university',
      title: 'Visiting Student',
      location: 'Massachusetts Institute of Technology',
    }, {
      date: 'Sept 2020 - Present',
      icon: 'university',
      title: 'B.S. in Computer Science',
      location: 'Southern University of Science and Technology',
    }, {
      date: 'Sept 2017 - July 2020',
      icon: 'school',
      title: 'Middle School',
      location: 'Guangzhou No.2 High School',
    }],
  interests: [
    {
      icon: 'layer-group',
      title: 'Computer Architecture',
    }, {
      icon: ['fab', 'linux'],
      title: 'Operating Systems',
    }, {
      icon: 'cloud',
      title: 'Cloud Computing',
    }],
  experience: [
    /*
    {
      title: 'Work',
      position: 'left',
      data: [
        {
          date: 'Aug 2019 - Present',
          title: 'Software Engineer',
          location: 'Somewhere',
          description: 'description',
        },
      ],
    },
    */
    {
      title: 'Teaching',
      position: 'right',
      data: [
        {
          date: 'Sept 2022 ~ Jan 2023, Sept 2023 ~ Current',
          title: 'Student Assistant of Data Structures and Algorithm Analysis',
          location: 'SUSTech',
        }, {
          date: 'Feb 2022 ~ June 2022, Sept 2022 ~ Jan 2023',
          title: 'Student Assistant of Algorithm Design and Analysis',
          location: 'SUSTech',
        }, {
          date: 'Sept 2022 ~ Jan 2023',
          title: 'Student Assistant of Artificial Intelligence',
          location: 'SUSTech',
        },
      ],
    },
    {
      title: 'OI / ICPC / CCPC',
      position: 'left',
      data: [
        {
          date: 'Jan 2021 ~ Dec 2021',
          title: 'Leader of SUSTech Collegiate Programming Team',
          location: 'SUSTech',
        }, {
          date: 'The 4th Southern University of Science and Technology Collegiate Programming Contest',
          title: 'Contest Director',
          location: 'SUSTech',
        }, {
          date: 'Sept 2020 ~ Aug 2022',
          title: 'ICPC Team: **SUSTech Madrid**, **SUSTech Argovie**',
          location: 'SUSTech',
        }, {
          date: 'Sept 2017 ~ Aug 2019',
          title: 'OI-er',
          location: 'Guangzhou No.2 High School',
        },
      ],
    },
  ],
  awards: [
    {date: 'Nov 2022', title: '2nd Place, IndySCC22 Student Cluster Competition Online'}, 
    {date: 'Apr 2022', title: 'Gold Medal, The 2021 ICPC Asia Macau Regional Contest'}, 
    {date: 'Nov 2021', title: 'Gold Medal, The 2021 ICPC Asia Shanghai Regional Contest'}, 
    {date: 'May 2021', title: 'Silver Medal, The 2020 ICPC Asia Macau Regional Contest'}, 
    {date: 'Apr 2021', title: 'Gold Medal, The 2020 ICPC Asia-East Continent Final'}, 
    {date: 'Dec 2020', title: 'Gold Medal, The 2020 ICPC Asia Shanghai Regional Contest'}, 
    {date: 'Nov 2020', title: 'Gold Medal, The 2020 China Collegiate Programming Contest Changchun Regional Contest'}, 
  ],
  tagColors: [
    'magenta', 'red', 'volcano', 'orange', 'gold',
    'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
  ],
  tags: [
    {
      id: 'javascript',
      name: 'javascript',
      description: 'JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.',
      color: '#f0da50',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'Node.js is a tool for executing JavaScript in a variety of environments.',
      color: '#90c53f',
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      description: 'RxJS is a library for reactive programming using Observables, for asynchronous operations.',
      color: '#eb428e',
    },
    {
      id: 'typescript',
      name: 'typescript',
      description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
      color: '#257acc',
    },
    {
      id: 'reactjs',
      name: 'reactjs',
      description: 'React is an open source JavaScript library used for designing user interfaces.',
      color: '#61dbfa',
    },
    {
      id: 'gatsby',
      name: 'Gatsby.js',
      description: 'A framework built over ReactJS to generate static page web application.  ',
      color: '#6f309f',
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'A markup language that powers the web. All websites use HTML for structuring the content.',
      color: '#dd3431',
    },
    {
      id: 'css',
      name: 'css',
      description: 'CSS is used to style the HTML element and to give a very fancy look for the web application.',
      color: '#43ace0',
    },
    {
      id: 'python',
      name: 'python',
      description: 'A general purpose programming language that is widely used for developing various applications.',
      color: '#f9c646',
    },
  ],
};
