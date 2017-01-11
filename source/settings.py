# -*- coding: utf-8 -*-
AUTHOR = u'Matt Makai'
SITENAME = u'Coding Across America'
SITEURL = 'http://www.codingacrossamerica.com'
TIMEZONE = 'America/New_York'
DEFAULT_PAGINATION = 10


GITHUB_URL = 'https://github.com/mattmakai/codingacrossamerica.com'
PDF_GENERATOR = False
PDF_STYLE = 'twelvepoint'
GOOGLE_ANALYTICS = 'UA-19910497-6'

DIRECT_TEMPLATES = ('index','pictures','interviews','startups','contact',
                    'tech-events','blog','coding-spots','opinions','cities')

BYLINE = '&copy; 2012-2017 Matt Makai. All Rights Reserved.'
LINKS = (
)

SOCIAL = (
    ('Email', 'mailto:matthew.makai@gmail.com'),
    ('GitHub', 'https://github.com/mattmakai'),
    ('Twitter', 'http://twitter.com/mattmakai'),
)

PROJECTS = (
)

JINJA_EXTENSIONS = (['jinja2.ext.autoescape',])
