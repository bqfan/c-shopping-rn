import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, ScrollView } from 'react-native'

import {
  AddToCartOperation,
  Description,
  FreeShipping,
  ImageGallery,
  Info,
  InitialStore,
  OutOfStock,
  SelectColor,
  SelectSize,
  ShowWrapper,
  SmilarProductsSlider,
  Specification,
} from '@/components'
import { useGetSingleProductDetailQuery } from '@/services'

export default function SingleProductScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  //? Get Feeds Query
  const {
    data: { product = {}, smilarProducts = {} },
    isLoading,
    isSuccess,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetSingleProductDetailQuery(
    { id },
    {
      selectFromResult: ({ data, ...args }) => ({
        data: data?.data || {},
        ...args,
      }),
    }
  )

  return (
    <>
      <Stack.Screen
        options={{
          title: product?.title || '',
        }}
      />
      <ShowWrapper
        error={error}
        isError={isError}
        refetch={refetch}
        isFetching={isFetching}
        isSuccess={isSuccess}
        type="detail"
      >
        <ScrollView className="bg-white">
          <View className="py-4 flex gap-y-4">
            <View className="h-fit">
              <InitialStore product={product} />
              <ImageGallery
                images={product.images}
                discount={product.discount}
                inStock={product.inStock}
                productName={product.title}
              />
              <View className="lg:col-span-4 ">
                {/* title */}
                <Text className="p-4 text-base font-semibold leading-8 tracking-wide text-black/80 ">
                  {product.title}
                </Text>

                <View className="section-divide-y h-2 bg-gray-100" />

                {product.inStock > 0 && product.colors.length > 0 && (
                  <SelectColor colors={product.colors} />
                )}

                {product.inStock > 0 && product.sizes.length > 0 && (
                  <SelectSize sizes={product.sizes} />
                )}
                {product.inStock === 0 && <OutOfStock />}

                <Info infos={product?.info} />

                <FreeShipping />
              </View>
            </View>
            <View>
              {product?.description?.length > 0 && (
                <Description description={product.description} />
              )}
            </View>
            <SmilarProductsSlider smilarProducts={smilarProducts} />
            <View className="section-divide-y h-2 bg-gray-100" />
            <Specification specification={product.specification} />

            <View className="section-divide-y h-2 bg-gray-100" />

            {/* <Reviews
              numReviews={product.numReviews}
              prdouctID={product._id}
              productTitle={product.title}
            /> */}
          </View>
        </ScrollView>
        {product.inStock > 0 && (
          <View className="fixed bottom-0 left-0 right-0 z-20 lg:hidden">
            <AddToCartOperation product={product} />
          </View>
        )}
      </ShowWrapper>
    </>
  )
}