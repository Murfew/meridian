export default function stringifyQueryParams(
  queryParams: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((val) => {
        params.append(key, val);
      });
    } else {
      params.append(key, value);
    }
  });

  return params.toString();
}
