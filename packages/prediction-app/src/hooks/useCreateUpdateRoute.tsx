import { useDataMutation } from "@dhis2/app-runtime";


export const content = {
  data: ({ url }: { url: string }) => ({
    name: "chap",
    code: "chap",
    disabled: false,
    url: url,
    headers: {
      "Content-Type": "application/json"
    },

  })
}

const routeUpdateMutation = {
  type: "update",
  resource: "routes",
  id: ({ id }: any): any => id as any,
  ...content
}


const routeCreateMutation = {
  type: 'create' as const,
  resource: "routes",
  ...content
}

const useCreateUpdateRoute = (route: { id: string, url: string } | undefined) => {

  const [createMutate, createMutateParams] = useDataMutation(routeCreateMutation);
  // @ts-expect-error - update mutation is not defined
  const [updateMutate, updateMutateParams] = useDataMutation(routeUpdateMutation);

  //create if route does not exisits
  if (!route) {
    return {
      mutate: createMutate,
      ...createMutateParams
    }
  }

  //update if route exisits
  return {
    mutate: updateMutate,
    ...updateMutateParams
  }
  //update if route exisits

};

export default useCreateUpdateRoute;
