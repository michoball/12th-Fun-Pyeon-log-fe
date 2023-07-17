import React from 'react'
import { CheckSquareFilled } from '@ant-design/icons'
import { SelectBox } from './Select.styles'

interface KeywordProps {
  title?: string
  keywordArray: string[]
  selected: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  selectType: 'brand' | 'keyword' | 'checkbox'
}

const Select: React.FC<KeywordProps> = ({
  title,
  keywordArray,
  selected,
  setSelected,
  selectType,
}) => {
  const selectToggle = (item: string) => {
    setSelected((prev) => {
      if (!prev.includes(item)) {
        return [...prev, item]
      } else {
        return prev.filter((e) => e !== item)
      }
    })
  }

  return (
    <SelectBox className={selectType}>
      {title && <p>{title}</p>}
      <ul>
        {keywordArray.map((item) => (
          <li
            key={item}
            onClick={() => selectToggle(item)}
            className={selected.includes(item) ? 'on' : ''}
          >
            {selectType === 'checkbox' && <CheckSquareFilled />}
            <span className="desc">{item}</span>
          </li>
        ))}
      </ul>
    </SelectBox>
  )
}

export default Select
