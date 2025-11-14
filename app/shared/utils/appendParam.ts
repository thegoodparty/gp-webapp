import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { ReadonlyURLSearchParams } from 'next/navigation'

const appendParam = (
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams,
  key: string,
  value: string,
): void => {
  const params = new URLSearchParams(searchParams.toString())
  params.delete(key)
  params.append(key, value)
  router.push(`?${params.toString()}`)
}

export default appendParam

