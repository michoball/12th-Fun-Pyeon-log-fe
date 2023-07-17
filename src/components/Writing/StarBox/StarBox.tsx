import React from 'react'
import { STAR_COUNT } from '@utils/constants'
import { StarFilled } from '@ant-design/icons'
import { Stars } from './StarBox.styles'

interface StarProps {
  starCount: number
  setStarCount: React.Dispatch<React.SetStateAction<number>>
}

const StarBox: React.FC<StarProps> = ({ starCount, setStarCount }) => {
  return (
    <Stars>
      <p>별점</p>
      <ul>
        {STAR_COUNT.map((el) => (
          <StarFilled
            key={el}
            onClick={() => setStarCount(el + 1)}
            className={el < starCount ? 'clicked' : ''}
          />
        ))}
      </ul>
    </Stars>
  )
}

export default StarBox
