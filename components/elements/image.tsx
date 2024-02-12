import Image, { ImageProps } from "next/image"
import { Media } from "types"

type Props = {
  media: Media
} & Omit<ImageProps, "src" | "alt">

const NextImage = ({ media, ...props }: Props) => {
  const { name, alternativeText } = media

  // The image has a fixed width and height
  if (props.width && props.height) {
    return (
      <Image
        alt={alternativeText}
        src={name}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUlfffDwACWAFUCYgi4QAAAABJRU5ErkJggg=="
        placeholder="blur"
        lazyBoundary="5px"
        loader={({ src }) => {
          return src
        }}
        {...props}
      />
    )
  }

  // The image is responsive
  return (
    <Image
      alt={alternativeText}
      layout="responsive"
      width={media.width}
      height={media.height}
      objectFit="contain"
      src={name}
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUlfffDwACWAFUCYgi4QAAAABJRU5ErkJggg=="
      placeholder="blur"
      lazyBoundary="5px"
      loader={({ src }) => {
        return src
      }}
      {...props}
    />
  )
}

export default NextImage
