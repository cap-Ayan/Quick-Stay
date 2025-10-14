import React from 'react'

const Title = ({title,subTitle,align,font}) => {
  return (
    <div className={`text-center  flex flex-col justify-center items-center ${align==='left'?'items-start':'text-left'}`}>
        <h1 className={`text-3xl md:text-[40px] ${font } text-gray-900`}>{title}</h1>
        <p className={`text-sm md:text-base text-gray-500/90 mt-2 max-w-174 ${align==='left'?'text-left':'text-center'}`}>{subTitle}</p>
    </div>
  )
}

export default Title