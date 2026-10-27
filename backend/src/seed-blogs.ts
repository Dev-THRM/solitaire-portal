import 'dotenv/config';
import prisma from './config/db';

async function seedBlogs() {
  console.log('[SEED] Seeding sample blog article...');

  const count = await prisma.blogPost.count();
  if (count > 0) {
    console.log(`[INFO] Already have ${count} blog posts in database.`);
    return;
  }

  const sampleBlog = await prisma.blogPost.create({
    data: {
      title: 'The Modern Butler: Essential Skills for Ultra-Luxury Residences in Dubai',
      slug: 'the-modern-butler-essential-skills-dubai',
      excerpt: 'Discover what leading private families and luxury hospitality estates in the UAE look for when recruiting premier household staff and private butlers.',
      content: `<h2>The Evolution of Private Estate Staffing in the UAE</h2>
<p>In the world of high-net-worth households across Dubai, Abu Dhabi, and the wider Gulf region, the role of the modern butler has evolved from traditional ceremonial service into a multifaceted estate coordination executive. Today’s premier residences require discretion, technological agility, cross-cultural diplomacy, and formal silver service excellence.</p>

<blockquote>"True luxury service is anticipation without intrusion. A premier butler understands what a principal needs moments before they voice it."</blockquote>

<h2>Key Competencies Top Employers Expect</h2>
<p>When our recruitment specialists evaluate candidates for elite household placements, five foundational pillars distinguish exceptional candidates:</p>
<ul>
  <li><strong>Flawless Formal Etiquette:</strong> Deep expertise in formal protocol, VIP dignitary reception, and international dining traditions.</li>
  <li><strong>Smart Home & Estate Automation:</strong> Seamless control over modern integrated home automation systems, climate zones, and security protocols.</li>
  <li><strong>Discretion & Confidentiality:</strong> Absolute confidentiality regarding family affairs, high-profile guests, and private schedules.</li>
  <li><strong>Cross-Functional Leadership:</strong> Managing and coordinating household teams, including private chefs, chauffeurs, housekeepers, and security details.</li>
</ul>

<h2>Connecting Talent with Exceptional Opportunities</h2>
<p>At Solitaire HR Consultancy, we bridge the gap between verified household professionals and prestigious estates. If you are looking to advance your private staffing career in Dubai, we encourage you to <a href="/jobs" class="blog-internal-link">explore our active luxury career opportunities</a> or review our <a href="/#services" class="blog-internal-link">specialized household staffing services</a>.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      category: 'Career Advice',
      author: 'Solitaire Editorial Team',
      readTime: '4 min read',
      metaTitle: 'The Modern Butler: Essential Skills for Dubai Luxury Estates | Solitaire HR',
      metaDescription: 'Explore the key skills, etiquette, and qualifications needed to secure top-tier butler and private estate positions in Dubai and the UAE.',
      canonicalUrl: 'https://solitairehr.com/blogs/the-modern-butler-essential-skills-dubai',
      keywords: 'butler dubai, luxury private staffing, estate manager uae, hospitality careers',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('[OK] Sample blog post created:', sampleBlog.title);
}

seedBlogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
