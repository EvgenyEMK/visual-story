# 1. Business context

Startup to create SaaS platform that makes it simple for users to
## 1.1. create engaging and visually compelling slides with animation and voice-over (text to voice)
    - each "key message" is represented by one or several visual slides where each slide has few animated elements (visual focus, no overload)
    - AI automated synchronization between voice-over and the animation of elements within the slide or-and transition between slides
    - Each element on the slid has text notes for off-line review
    - one slide may include animation sub-slides to visually show multiple parts of the message with intial, interim and end states of the visual

## 1.2. Link visual elements within slide to data sources
    - Example 1: link group of boxes with text to Jira or Asana ticket, so the text or formatting changes automatically based on ticket field values
    - Example 2: Define legend of item statuses (icon, color) once, so each element within the slide can easily be switched to one of statuses in the legend

## 1.3. Add dynamic context for visual elements on a slide
    - Example 1: slide notes with sub-sections, each section linked to given element on the slide
    - Example 2: additional details of given slide element are shown on click or on hover


# 2. Product Purpose & Vision
    Automate creation of compelling visual stories with animated content and voice-over available as slide show and as recorded video
    Transform static slides to engaging dynamic content that can be (a) linked to data sources and (b) can provide extra context on click on visual element
    The system should feel like “a motion designer embedded in the product”


# 3. User needs (problem statement)
## 3.1. Manual animation is too complex and time consuming

    Users want professional, story-driven animated slides but:
    - don’t know animation principles,
    - don’t want to manually configure transitions,
    - struggle to synchronize visuals with narration
    - want to rely on proven animation templates (within and between slides)

## 3.2. Auto-play or recorded animations syncronized with voice in multi-language

    Users need slides that can be reviewed manually slide-by-slide or can be presented in auto-play mode with voice over that is synchronized with animation, including multi-languge scenario.
    - no such tools on the market today
    - too complex to do manually, - must be automated
    - ideally should support two modes: auto-play, and play for selected slide / sub-slide

## 3.3. Automatically proposed visual assets 

    Visually compelling slides often include icons, images, short videos per element or slide backgound.
    Users need the tool to automatically generate / propose such assets based on slide context.
    Users also need the assets to match selected brand guidelins (e.g. color theme)

## 3.4. Content and/or formatting of slide elements linked to data source

    Users want the slide content to reflect the latest status of project, task or similar.
    For example, the slide represents functional structure of elements and colors should indicate current status per element (to do, in-progress, done, issue, at risk, etc.)

# 4. Target market and Ideal Customer Profile (ICP)

## 4.1. Primary Target: Individual Content Creators

**Who they are:**
- Solo content creators and small teams (1-3 people) building audiences on YouTube, online courses, social media
- Tech-savvy professionals who understand content creation but lack design/animation skills
- Educators, coaches, consultants, and thought leaders who need to communicate complex ideas visually

**Demographics:**
- Age: 25-45
- Location: Global (English-speaking markets primary)
- Technical proficiency: Comfortable with SaaS tools, not professional designers

**Pain Points:**
- Spend 5-10+ hours creating one animated video manually
- Outsourcing to motion designers costs $200-500+ per video
- Existing tools require steep learning curve (After Effects) or produce generic results (Canva)
- Struggle to synchronize voiceover with visual animations

**Budget & Willingness to Pay:**
- $20-50/month for tools that save significant time
- High price sensitivity but willing to pay for clear ROI (time saved)

**Primary Channels:**
- YouTube (explainer videos, tutorials)
- Online course platforms (Udemy, Teachable, Skillshare)
- LinkedIn (thought leadership content)
- Twitter/X (short-form educational content)

## 4.2. Secondary Personas (Phase 2+)

- **Marketing teams at startups/SMBs**: Need quick turnaround on product demos, pitch decks
- **Enterprise teams**: Need data-connected visuals for status updates, roadmaps (requires Jira/Asana integration)

## 4.3. Business Model

**Freemium model:**
- **Free tier**: Limited exports (e.g., 2 videos/month), watermark, basic templates
- **Pro tier** ($29-49/month): Unlimited exports, no watermark, premium templates, priority rendering
- **Team tier** ($99+/month): Collaboration features, brand kit, advanced integrations

# 5. Competitive analysis

See detailed analysis in [competitive-analysis.md](./competitive-analysis.md) 

# 6. MVP - Minimum Viable Product

See detailed MVP specification in [MVP-Minimum-Viable-Product.md](./MVP-Minimum-Viable-Product.md)

# 7. Solution summary - user experience, key product modules and features

## 7.1. User experience

    1. User provides the story script he wants to develop as visual story, including the overall intent and key messages / sections. SaaS helps user with feedback to improve the story (hook, structure, call to action, closing message, etc.)
    2. Based on internal library of animations (group of elements, slide transitions, etc.) the SaaS generatates slides and sub-slides to represent the story in animated way
    3. User can change adjust given slide (or set of slides) with a prompt - SaaS generates new version (ideally sevreal alternatives) with possibility to roll back. Icons+text only (images as placeholders at this stage)
    4. Once the overall slide structure and animation is Ok for user, images can be generated if needed (per slide element or-and background)
    5. Publish content, or export to video

# 8. Technology architecture

See detailed technical architecture in [../technical-architecture/overview.md](../technical-architecture/overview.md)
