'use client'
import React, { useState } from 'react'
import { Address, Shipping, Payment, Edit, Delete, PlusLine } from '@/app/icons'
import Heading from '@/app/components/ui/Heading'
import  Radio  from '@/app/components/ui/Radio'
import  Paragraph  from '@/app/components/ui/Paragraph'
import  Button  from '@/app/components/ui/Button'
import DateSelector from '@/app/components/ui/DateSelector'
import Tabs from '@/app/components/ui/Tabs'
import Input from '@/app/components/ui/Input'
import CheckBox from '@/app/components/ui/CheckBox'
import CreditCardPreview from '@/app/components/ui/CreditCardPreview'

const paymentTabs = [
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'paypal-credit', label: 'PayPal Credit' },
]

function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
}
const checkoutSteps = [
    {
        id: 1,
        step: 1,
        title: 'Address',
        Icon: Address,
    },
    {
        id: 2,
        step: 2,
        title: 'Shipping',
        Icon: Shipping,
    },
    {
        id: 3,
        step: 3,
        title: 'Payment',
        Icon: Payment,
    },
]
const addresses = [
    {
      id: 1,
      address: "2118 Thornridge",
      fullAddress: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      phone: "(209) 555-0104",
      email: "",
      type: "HOME",
      isDefault: true,
    },
    {
      id: 2,
      address: "Headoffice",
      fullAddress: "2715 Ash Dr. San Jose, South Dakota 83475",
      phone: "(704) 555-0127",
      email: "",
      type: "OFFICE",
      isDefault: false,
    },
  ];
  const shippingMethods = [
    {
      "id": 1,
      "price": "Free",
      "title": "Regularly shipment",
      "date": "17 Oct, 2023",
      "selected": true
    },
    {
      "id": 2,
      "price": "$8.50",
      "title": "Get your delivery as soon as possible",
      "date": "1 Oct, 2023",
      "selected": false
    },
    {
      "id": 3,
      "price": null,
      "title": "Schedule",
      "description": "Pick a date when you want to get your delivery",
      "date": null,
      "datePlaceholder": "Select Date",
      "selected": false
    }
  ]
const TypeStripe = ({ type }) => {
  return (
    <div className='bg-primary px-[8px] rounded-[4px] h-[23px] flex items-center justify-center'>
      <Paragraph type='typeStripe' className='text-white'>{type}</Paragraph>
    </div>
  )
}
const AddressCard = ({ address }) => {
  return (
    <div className='bg-surface-card p-[24px] rounded-[8px] flex flex-col gap-[16px] md:flex-row md:justify-between md:items-center md:gap-0'>
      <div className='flex items-start gap-[16px]'>
        <Radio
          id={`address-${address.id}`}
          name='address'
          value={address.id}
          checked={address.isDefault}
          onChange={() => {}}
          width='24px'
          height='24px'
        />
        <div className='flex flex-col items-start gap-[16px] flex-1 min-w-0'>
          <div className='flex items-center md:gap-[16px] gap-[25px]'>
            <Paragraph type='address'>{address.address}</Paragraph>
            <TypeStripe type={address.type} />
          </div>
          {/* Mobile: details + actions share one row under title */}
          <div className='flex justify-between items-center md:items-start md:gap-[16px] w-full md:contents '>
            <div className='flex flex-col items-start gap-[8px] md:gap-[8px]'>
              <Paragraph type='address' className='!tracking-[-1.1px]'>{address.fullAddress}</Paragraph>
              <Paragraph type='address' className='!tracking-[-1.1px]'>{address.phone}</Paragraph>
            </div>
            <div className='flex items-center gap-[24px] shrink-0 md:hidden mt-[-40px] md:mt-0'>
              <Edit />
              <Delete />
            </div>
          </div>
        </div>
      </div>
      <div className='hidden md:flex items-center gap-[24px]'>
        <Edit />
        <Delete />
      </div>
    </div>
  )
}
const AddressForm = () => {
  return (
    <div className='flex flex-col gap-[32px]'>
      <Heading as='h3' variant='checkoutStepTitle'>Select Address</Heading>
      <div className='flex flex-col gap-[24px]'>
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
      <div className='flex items-center justify-center gap-[8px] pt-[16px] cursor-pointer flex-col'>
        <PlusLine />
        <Paragraph type='cart'>Add New Address</Paragraph>
      </div>
    </div>
  )
}
const ShippingForm = ({ shippingMethods }) => {
  return (
    <>
    <div className='flex flex-col gap-[16px] md:gap-[15px]'>
      <div className='mb-[16px]'>
     <Heading as='h3' variant='checkoutStepTitle'>Shipment Method</Heading>
     </div>
    {shippingMethods.map((shippingMethod) => (
    
     
      <div className='bg-white border border-gray-200 p-[24px] rounded-[8px]' key={shippingMethod.id}>
      <div className='flex flex-col gap-[24px]'>
        <div className='grid grid-cols-2 items-center justify-between '>
         
          <div className='flex flex-col md:flex-row items-start gap-[8px] md:gap-[16px]'>
          <Radio
            id='shipping-method-1'
            name='shipping-method'
            value='shipping-method-1'
            checked={true}
            onChange={() => {}}
            width='24px'
            height='24px'
          />
            {shippingMethod.price && <Paragraph type='shipping'>{shippingMethod.price}</Paragraph>}
            {shippingMethod.title && <Paragraph type='shipping'>{shippingMethod.title}</Paragraph>}
            {shippingMethod.description && <Paragraph type='shipping'>{shippingMethod.description}</Paragraph>}
          </div>
          <div className='col-span-1 flex items-center justify-end'>
            {shippingMethod.date ? <Paragraph type='shipping'>{shippingMethod.date}</Paragraph> : <DateSelector type="calendar" />}
          </div>
        </div>
      </div>
     
    </div>
    ))}
     </div>
    </>
  )
}
const PaymentForm = () => {
  const [activeTab, setActiveTab] = useState('credit-card')
  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expDate, setExpDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [paypalEmail, setPaypalEmail] = useState('')

  const previewNumber = cardNumber || '4085 9536 8475 9530'
  const previewName = cardholderName || 'Cardholder'

  return (
    <div className='flex flex-col gap-[32px]'>
      <Heading as='h3' variant='checkoutStepTitle'>Payment</Heading>
      <Tabs
        tabs={paymentTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className='mb-0 justify-between gap-0 2xl:mb-0'
        tabClassName='text-center'
      />

      {activeTab === 'credit-card' && (
        <div className='flex flex-col gap-[24px] '>
          <div className='flex items-center justify-center'>
            <CreditCardPreview cardNumber={previewNumber} cardholder={previewName} />
          </div>
          <div className='flex flex-col gap-[16px]'>
            <Input
              placeholder='Cardholder Name'
              variant='base'
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
            <Input
              placeholder='Card Number'
              variant='base'
              inputMode='numeric'
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            />
            <div className='grid grid-cols-2 gap-[16px]'>
              <Input
                placeholder='Exp. Date'
                variant='base'
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
              />
              <Input
                placeholder='CVV'
                type='password'
                variant='base'
                inputMode='numeric'
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
          </div>
          <CheckBox
            label='Same as billing address'
            showLabel
            checked={sameAsBilling}
            onChange={setSameAsBilling}
          />
        </div>
      )}

      {activeTab === 'paypal' && (
        <div className='flex flex-col gap-[24px]'>
          <div className='rounded-[16px] border border-border-light bg-surface-card p-[24px] flex flex-col gap-[12px]'>
            <Paragraph type='address'>Pay with PayPal</Paragraph>
            <Paragraph type='cart' className='text-muted'>
              Enter your PayPal email. You will be redirected to PayPal to complete your purchase securely.
            </Paragraph>
          </div>
          <Input
            type='email'
            placeholder='PayPal Email'
            variant='base'
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
          <CheckBox
            label='Same as billing address'
            showLabel
            checked={sameAsBilling}
            onChange={setSameAsBilling}
          />
        </div>
      )}

      {activeTab === 'paypal-credit' && (
        <div className='flex flex-col gap-[24px]'>
          <div className='rounded-[16px] border border-border-light bg-surface-card p-[24px] flex flex-col gap-[12px]'>
            <Paragraph type='address'>PayPal Credit</Paragraph>
            <Paragraph type='cart' className='text-muted'>
              Buy now and pay over time with PayPal Credit. Subject to credit approval.
            </Paragraph>
          </div>
          <Input
            type='email'
            placeholder='PayPal Email'
            variant='base'
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
          <Input
            placeholder='Full Name'
            variant='base'
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
          <CheckBox
            label='Same as billing address'
            showLabel
            checked={sameAsBilling}
            onChange={setSameAsBilling}
          />
        </div>
      )}
    </div>
  )
}
export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  // Mobile: always show current + next (or last two when on final step)
  const mobileStart = Math.min(step - 1, checkoutSteps.length - 2)
  const mobileSteps = checkoutSteps.slice(mobileStart, mobileStart + 2)

  const renderStep = (checkoutStep) => {
    const isActive = checkoutStep.step === step
    const tone = isActive ? '!text-primary' : '!text-step-muted'
    const { Icon } = checkoutStep
    return (
      <div key={checkoutStep.id} className='flex items-center gap-[8px] w-[160px] shrink-0 '>
        <Icon className={tone} />
        <div>
          <Heading as='h3' variant='checkoutStep' className={tone}>
            Step {checkoutStep.step}
          </Heading>
          <Heading as='h4' variant='checkoutStepTitle' className={tone}>
            {checkoutStep.title}
          </Heading>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-center'>
      <div className='container'>
        <div className='md:py-[72px] py-[32px]'>
          <div className='flex items-center gap-[21px] md:hidden'>
            {mobileSteps.map(renderStep)}
          </div>
          <div className='hidden md:flex md:items-center md:justify-between gap-[21px]'>
            {checkoutSteps.map(renderStep)}
          </div>
        </div>
        <div className='my-[48px] flex flex-col gap-[32px]'>
          {step === 1 && <AddressForm />}
          {step === 2 && <ShippingForm shippingMethods={shippingMethods} />}
          {step === 3 && <PaymentForm />}
          <div className='flex items-center justify-end gap-[24px] pt-[32px]'>
            <Button
              variant='dark'
              className='!h-[64px] md:!w-[210px] !w-[158px] !min-w-[158px]'
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                variant='fill-dark'
                className='!h-[64px] md:!w-[210px] !w-[158px] !min-w-[158px]'
                onClick={() => setStep((s) => s + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant='fill-dark'
                className='!h-[64px] md:!w-[210px] !w-[158px] !min-w-[158px]'
              >
                Pay
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}