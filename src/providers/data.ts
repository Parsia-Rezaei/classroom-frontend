import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";
import { ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

if (!BACKEND_BASE_URL) {
  throw new Error(
    "BACKEND_BASE_URL is not configured, Please set VITE_BACKEND_BASE_URL in .env file",
  );
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload?.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (resource === "departments") {
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }
      });
      return params;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
export { dataProvider };
