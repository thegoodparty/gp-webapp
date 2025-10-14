'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import ResourceCard from './ResourceCard'
import { RESOURCES_DATA } from './resourcesData'

const ResourcesPage = (props) => {
  const categories = ['Guides', 'Templates', 'Tactics']

  const getResourcesByCategory = (category) =>
    RESOURCES_DATA.filter((resource) => resource.category === category)

  return (
    <DashboardLayout {...props}>
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryResources = getResourcesByCategory(category)
          return categoryResources.length > 0 ? (
            <div key={category} className="flex flex-col gap-3">
              <h2
                className="
                  text-lg
                  font-medium
                  text-[#1e1f20]
                  leading-6
                "
              >
                {category}
              </h2>
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:flex
                  md:flex-wrap
                  gap-6
                "
              >
                {categoryResources.map(({ id, title, url, imageUrl }) => (
                  <ResourceCard
                    key={id}
                    {...{
                      id,
                      title,
                      url,
                      category,
                      imageUrl,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null
        })}
      </div>
    </DashboardLayout>
  )
}

export default ResourcesPage

