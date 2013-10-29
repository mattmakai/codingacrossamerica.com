Why Does Building Software for the Government Cost So Much?
===========================================================

:slug: why-does-building-software-for-government-cost-so-much
:date: 2013-10-29
:category: post
:post_type: opinion
:author: Matt Makai
:tag: software development, government


The latest US government software project under the news media spotlight is 
the `healthcare.gov <http://www.healthcare.gov/>`_ website. The 
"`at least $350 million <http://www.washingtonpost.com/blogs/fact-checker/wp/2013/10/24/how-much-did-healthcare-gov-cost/>`_" 
project has let few visitors complete the sign up process. When the
sign up process actually is successful, the 
`wrong data is often being sent to insurers <http://www.theverge.com/2013/10/18/4851998/healthcare-gov-is-sending-insurers-wrong-data>`_. The New York Times
covered how technical issues turned into political difficulties:
  
  For the first time in history, a president has had to stand in the Rose 
  Garden to apologize for a broken Web site. But HealthCare.gov is only the 
  latest episode in a string of information technology debacles by the 
  federal government.

  `Clay Johnson and Harper Reed NY Times Op-Ed <http://www.nytimes.com/2013/10/25/opinion/getting-to-the-bottom-of-healthcaregovs-flop.html?pagewanted=all&_r=0>`_

Despite the current issues with healthcare.gov, at least the website 
launched on time. The same cannot be said for many expensive 
government projects, such as the 
`FBI's Virtual Case Management System <http://www.washingtonpost.com/wp-dyn/content/article/2006/08/17/AR2006081701485.html>`_.

Why are these high profile failures and massive cost overruns so common in
government software development projects? This is a list of the most 
significant issues that arise on these projects from my personal experience 
in software development across several government agencies 
(`US Army <http://www.pcb007.com/pages/zone.cgi?a=48412>`_, 
`FBI <http://www.fiercegovernmentit.com/story/fbis-innovari-could-fail-says-ig/2010-08-09>`_, 
`CFPB <http://radar.oreilly.com/2012/04/open-source-government-cfpb.html>`_) 
and commercial and non-profit organizations 
(`Marriott <http://www.marriott.com/>`_, 
`Freddie Mac <http://www.freddiemac.com/>`_, 
`The Motley Fool <http://www.foolfunds.com/>`_, 
`NTI <http://www.nti.org/>`_, `GWU <http://www.gwu.edu/>`_).


Those Holding the Purse Strings Are Not Users
---------------------------------------------
The government has a formal title for the guy who's in charge of the contract
and related financial decisions: Contracting Officer Representative (COR). 
The COR is generally not an actual user. In a worst case scenario there are 
multiple owners, none of whom will actually use the software, and everyone 
has to put their stamp on every decision. Non-users are inclined to approve 
flashy features and functionality that have no mission value but look good 
during a demo.

There needs to be a better way to determine what value is provided to actual
users. However, even in this case there are often problems. Many end users do
not want a new software system. They sometimes do not want to retrain on a
new system or are concerned that their jobs will be replaced once the new 
system is up and running.


Time (Money) Is Needed to Justify Every Choice
----------------------------------------------
Justifying the use of common software libraries can often take multiple 
weeks over periods of several months. Software developers are often asked 
to create lengthy white papers and extensive documentation for simple code 
reuse scenarios. Often this culture discourages software developers from 
reusing proven, tested code because it would take longer to justify their 
choice of library, than to rewrite the code from scratch.  

In addition, the developer is accepts responsibility that if there are any
future issues with that reused code, justified or not, she is to blame.
Essentially the development process takes much longer than expected so that 
everyone can cover their ass with documentation in case of failure.


Budget Process
--------------
All budget must be requested up front, often in multi-year estimates. The
software development estimation process is impossible on such long time 
scales. Projects literally set themselves up for failure and inaccurate 
budgets before they even begin.

The flip side of this budget process situation is that even if a company
believes it can solve a problem cheaply, they are incentivized to pad 
estimates because no further funding can be requested in the future.


No Third Party Services
-----------------------
Third party services are `near and dear to my heart <http://www.youtube.com/watch?v=iGP8DQIqxXs&list=SPtqtTJ4wP09YOFqm_lBCoQtmS6S0omW3J&index=29>`_ 
because when properly leveraged developers can build applications 
orders of magnitudes faster than by building everything from scratch. 

The value proposition of third party services is clear. By paying 
`New Relic <http://newrelic.com/>`_ $24 a month for instantly 
integrated, powerful application-level monitoring, I don't have to rebuild
that functionality myself. New Relic has invested millions of dollars
into their platform. There's no reason for me to duplicate that functionality, 
or the features of other platforms like 
`Dropbox <https://www.dropbox.com/>`_, 
`Twilio <https://www.twilio.com/>`_, 
`CopperEgg <http://copperegg.com/>`_, 
`Heroku <https://www.heroku.com/>`_ 
(the list goes on and on) 
**except to comply with often arbitrary government data regulations and information assurance questionnaires**. 

In some cases these regulations are justified. In other cases, there is no
logical reason why data cannot be stored on an existing third party 
platform. Explaining why though goes back to the justification problem 
explained above.


"I Want Everything, or Nothing"
-------------------------------
The culture around government projects remains skewed towards "big bang"
project introductions. Gradually rolling out a new system to users is 
rare. The idea is that "unless every piece of functionality is there, 
it is useless" prevents systems from quickly getting into users' hands. Only
when users are actually working with a system can they can determine what 
functionality is actually useful to them.

Government project phases are not iterative because they are often several 
months or years long. Agile software engineering demands short feedback loops
on the maximum timescale of several weeks between production deployments. 

In addition, government employee software developers and consultants 
often recommend reasonable approaches to solving problems iteratively 
but culturally there is significant resistance to those ideas.


No Quick Fixes
--------------
The above problems are difficult issues to solve. Anyone with a "silver 
bullet" for how government can easily build large complex software project 
is selling snake oil. Increasing success rates on major government software 
development projects will only come about through a combination of cultural 
changes, greater technical understanding (by everyone involved in projects, 
not just software developers), and a budget process that allows project 
funding on less expensive iterative engineering methods.

