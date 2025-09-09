const appendParam = (router, searchParams, key, value) => {
  const params = new URLSearchParams(searchParams.toString())
  params.delete(key)
  params.append(key, value)
  router.push(`?${params.toString()}`)
}

export default appendParam
