import Paragraph from './ui/Paragraph'
import Image from 'next/image'
import Heading from './ui/Heading'
import Button from './ui/Button'
import { Minus, Plus, Cross } from '../icons'
import { useState } from 'react'

const QuantitySelector = ({ quantity, setQuantity }: { quantity: number, setQuantity: (quantity: number) => void   }) => {
  return (
    <div className="flex items-center justify-center h-[32px] gap-[9px]">
      <Button variant="icon" onClick={() => setQuantity(quantity - 1)} className="!w-[24px] !h-[24px] !min-w-[24px] !min-h-[24px]">
        <Minus />
      </Button>
     <Paragraph as="span" type="cartQuantity">{quantity}</Paragraph>
      <Button variant="icon" onClick={() => setQuantity(quantity + 1)} className="!w-[24px] !h-[24px] !min-w-[24px] !min-h-[24px]">
        <Plus />
      </Button>
    </div>
  )
}

export default function CartStrip({ product, isLast }: { product: any, isLast: boolean }) {
  const [quantity, setQuantity] = useState(product.quantity);
  return (
    <div className={`grid grid-cols-[auto_1fr] items-center gap-x-[16px] gap-y-[8px] border-b-[0.5px] border-surface-line-gray pt-[24px] pb-[56px] 2xl:pb-[31px] lg:flex lg:flex-col lg:items-center lg:gap-[24px] 2xl:flex-row 2xl:justify-between 2xl:gap-0 ${isLast ? '!border-b-0' : 'border-b'}`}>
      <div className="contents lg:flex lg:items-center lg:gap-4">
        <Image
          src={product.image}
          alt={product.name}
          width={90}
          height={90}
          className="row-span-2 shrink-0 self-center"
        />

        <div className="min-w-0 lg:max-w-[190px]">
          <Heading as="h3" variant="card" className="!text-left">
            {product.name}
          </Heading>

          <Paragraph type="body" className="mt-2">
            {product.serialNumber}
          </Paragraph>
        </div>
      </div>

      <div className="col-start-2 flex w-full items-center justify-between lg:w-auto lg:justify-start lg:gap-[24px]">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
        />

        <Heading as="h3" variant="cartTotal">
          ${product.price}
        </Heading>

        <Button
          variant="icon"
          className="!p-0 border-0"
        >
            <Cross />
          </Button>
      </div>
    </div>
  );
}
