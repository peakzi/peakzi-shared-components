import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const componentEntries = [
  'Accordion',
  'Alert',
  'AppFooter',
  'Avatar',
  'Badge',
  'Banner',
  'Breadcrumbs',
  'BusinessSiteHeader',
  'BusinessSiteFooter',
  'BusinessSiteHero',
  'BusinessSiteServices',
  'BusinessSiteServicesDirectory',
  'BusinessSiteServiceDetail',
  'BusinessSiteAreas',
  'BusinessSiteAreasDirectory',
  'BusinessSiteFaq',
  'BusinessSiteReviews',
  'BusinessSiteOffers',
  'BusinessSiteProjectGallery',
  'BusinessSiteBlogs',
  'BusinessSiteContentList',
  'BusinessSiteContentFilterNav',
  'Button',
  'Card',
  'Checkbox',
  'ColumnChart',
  'CopyField',
  'CodeSnippet',
  'DefList',
  'Dropdown',
  'EditableField',
  'EmptyState',
  'GaugeChart',
  'GeoMap',
  'Grid',
  'Input',
  'Modal',
  'Navbar',
  'PageHeader',
  'PeakziLogo',
  'PieChart',
  'Progress',
  'PyramidChart',
  'RadialGauge',
  'Section',
  'Segmented',
  'SideNav',
  'Slider',
  'Stack',
  'StatCard',
  'StatusPill',
  'Stepper',
  'Switch',
  'Table',
  'Tabs',
  'TimeSeriesChart',
  'Tooltip',
  'TreeMapChart',
] as const

const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  styles: resolve(__dirname, 'src/styles.ts'),
  BusinessSiteHeroCarousel: resolve(__dirname, 'src/components/BusinessSiteHero/carousel/BusinessSiteHeroCarousel.tsx'),
  BusinessSiteHeaderMenuBehavior: resolve(__dirname, 'src/components/BusinessSiteHeader/menu-behavior/HeaderMenuBehavior.tsx'),
  BusinessSiteOffersCarousel: resolve(__dirname, 'src/components/BusinessSiteOffers/carousel/BusinessSiteOffersCarousel.tsx'),
  BusinessSiteCardCarousel: resolve(__dirname, 'src/components/BusinessSiteCardCarousel/BusinessSiteCardCarousel.tsx'),
  BusinessSiteBlogCoverImage: resolve(__dirname, 'src/components/BusinessSiteBlogs/cover/BlogCoverImage.tsx'),
  BusinessSiteFaqAccordion: resolve(__dirname, 'src/components/BusinessSiteFaq/accordion/FaqAccordion.tsx'),
  BusinessSiteAreasMap: resolve(__dirname, 'src/components/BusinessSiteAreas/map/BusinessSiteAreasMap.tsx'),
  BusinessSiteContentFilterNavSheet: resolve(__dirname, 'src/components/BusinessSiteContentFilterNav/sheet/ContentFilterNavSheet.tsx'),
  BusinessSiteProjectGalleryPreview: resolve(__dirname, 'src/components/BusinessSiteProjectGallery/preview/BusinessSiteProjectGalleryPreview.tsx'),
  ...Object.fromEntries(
    componentEntries.map((name) => [name, resolve(__dirname, `src/components/${name}/index.ts`)]),
  ),
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/test/**'],
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Consumers supply shared runtime dependencies; keep them out of this bundle.
      // highcharts/leaflet are optional peers — only consumers using the chart/map
      // components need to install them, so they must never end up bundled here.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'lucide-react',
        /^lucide-react\//,
        'highcharts',
        'highcharts-react-official',
        /^highcharts\//,
        'leaflet',
        'leaflet.markercluster',
        /^leaflet\.markercluster\//,
        '@react-leaflet/core',
        'react-leaflet',
        /^react-leaflet\//,
      ],
      output: {
        // Keep the client boundary on extracted chunks too, not only their entry facades.
        banner: (chunk) => chunk.moduleIds.some((id) => /(?:BusinessSiteHeader\/menu-behavior\/HeaderMenuBehavior|BusinessSite(?:Hero|Offers)\/carousel\/BusinessSite(?:Hero|Offers)Carousel|BusinessSiteCardCarousel\/BusinessSiteCardCarousel|BusinessSiteBlogs\/cover\/BlogCoverImage|BusinessSiteFaq\/accordion\/FaqAccordion|BusinessSiteAreas\/map\/BusinessSiteAreasMap|BusinessSite(?:Areas|Services)Directory\/BusinessSite(?:Areas|Services)Directory|BusinessSiteContentFilterNav\/sheet\/ContentFilterNavSheet|BusinessSiteProjectGallery\/preview\/BusinessSiteProjectGalleryPreview)\.tsx$/.test(id.replace(/\\/g, '/')))
          ? '"use client";' : '',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'lucide-react': 'lucideReact',
          highcharts: 'Highcharts',
          'highcharts-react-official': 'HighchartsReact',
          leaflet: 'L',
          'react-leaflet': 'ReactLeaflet',
        },
      },
    },
    // Emit a single CSS file for the package "./styles" export.
    cssCodeSplit: false,
    cssFileName: 'components',
    assetsInlineLimit: 0,
    sourcemap: true,
  },
})
