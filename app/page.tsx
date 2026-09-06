import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { CategoryChips } from '@/components/category-chips'
import { ReelRow } from '@/components/reel-row'
import { PopularCategories } from '@/components/popular-categories'
import { VerifiedSuppliers } from '@/components/verified-suppliers'
import { HowItWorks } from '@/components/how-it-works'
import { SellerCta } from '@/components/seller-cta'
import { SiteFooter } from '@/components/site-footer'
import {
  trending,
  recommended,
  recentlyAdded,
  services,
} from '@/lib/data'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <CategoryChips />

        <div id="trending">
          <ReelRow
            title="Trending reels"
            subtitle="Most-watched product videos this week"
            items={trending}
          />
        </div>

        <ReelRow
          title="Recommended for you"
          subtitle="Based on popular sourcing categories"
          items={recommended}
        />

        <PopularCategories />

        <ReelRow
          title="Services & solutions"
          subtitle="Engineering, logistics, installation and more"
          items={services}
        />

        <VerifiedSuppliers />

        <ReelRow
          title="Recently added"
          subtitle="Fresh listings from suppliers worldwide"
          items={recentlyAdded}
        />

        <HowItWorks />
        <SellerCta />
      </main>
      <SiteFooter />
    </div>
  )
}
