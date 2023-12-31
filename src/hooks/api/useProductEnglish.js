import { useQuery } from "@apollo/client";

import { GET_PRODUCT_BY_HANDLE_ENGLISH } from "../../graphql/server/productByHandleEnglish";

function useGetProductDetailsEnglish(options) {
  //   let [productDetails, setProductDetails] = useState(emptyProduct);
  //   let language = options.language;
  let { data, error, loading, refetch } = useQuery(
    GET_PRODUCT_BY_HANDLE_ENGLISH,
    {
      ...options,
    }
  );
  //   let [getVariant, { data: variantData, loading: variantLoading }] =
  //     useLazyQuery(GET_PRODUCT_VARIANT, {
  //       fetchPolicy: "network-only",
  //       language: language,
  //     });
  //   let productByHandle = data?.productByHandle;
  //   let variantProductByHandle = variantData?.productByHandle;

  //   useEffect(() => {
  //     if (productByHandle) {
  //       let images = productByHandle.images.edges.map(
  //         (item) => item.node.originalSrc
  //       );
  //       let originalProductPrice = Number(
  //         productByHandle.variants.edges[0].node.compareAtPriceV2?.amount
  //       );

  //       let productPrice = Number(
  //         productByHandle.variants.edges[0].node.priceV2.amount
  //       );

  //       let { price, discount } = getDiscount(originalProductPrice, productPrice);
  //       let newOptions = productByHandle.options;

  //       if (variantProductByHandle) {
  //         if (variantProductByHandle.variantBySelectedOptions == null) {
  //           setProductDetails({
  //             id: "",
  //             title: productByHandle.title,
  //             handle: productByHandle.handle,
  //             description: productByHandle.description,
  //             images,
  //             price,
  //             discount,
  //             url: productByHandle.onlineStoreUrl,
  //             options: newOptions,
  //             availableForSale: false,
  //             quantityAvailable: 0,
  //           });
  //         } else {
  //           let {
  //             id,
  //             compareAtPriceV2,
  //             priceV2,
  //             availableForSale,
  //             quantityAvailable,
  //           } = variantProductByHandle.variantBySelectedOptions;
  //           if (compareAtPriceV2) {
  //             let originalPrice = compareAtPriceV2.amount;
  //             let discount =
  //               (Math.abs(originalPrice - priceV2.amount) / originalPrice) * 100;
  //             setProductDetails({
  //               ...productDetails,
  //               price: Number(originalPrice),
  //               discount,
  //               availableForSale,
  //               id,
  //               quantityAvailable: quantityAvailable ?? 0,
  //             });
  //           } else {
  //             setProductDetails({
  //               ...productDetails,
  //               price: Number(priceV2.amount),
  //               discount: 0,
  //               availableForSale,
  //               id,
  //               quantityAvailable: quantityAvailable ?? 0,
  //             });
  //           }
  //         }
  //       } else {
  //         setProductDetails({
  //           id: productByHandle.id,
  //           title: productByHandle.title,
  //           handle: productByHandle.handle,
  //           description: productByHandle.description,
  //           images,
  //           price,
  //           discount,
  //           url: productByHandle.onlineStoreUrl,
  //           availableForSale: productByHandle.availableForSale,
  //           options: newOptions,
  //           quantityAvailable: 0,
  //         });
  //       }
  //     }
  //   }, [productByHandle, variantProductByHandle]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data: data,
    loading: loading,
    error,
    refetch,
  };
}

export { useGetProductDetailsEnglish };
