import React, { useState } from "react";

interface IProps {
  numOfPages: number;
  range: number;
  current?: number;
  onChange: (pageNum: number) => void;
}

export default function Pagination({
  numOfPages,
  range,
  current,
  onChange,
}: IProps) {
  function paginate(total: number, range: number, current: number): number[] {
    if (
      current < 1 ||
      current > total ||
      range % 2 === 0 ||
      range < 1
    )
      return [];

    if (total === 1) return [1];
    const arr = [];

    if (range > total) {
      for (let i = 1; i <= total; i++) {
        arr.push(i);
      }
      return arr;
    }

    if (current === 1) {
      let i = 1;
      while (i <= range + current) {
        arr.push(i);
        i++;
      }
      return [...arr, total];
    }
    const center = Math.floor(range / 2);
    if (current <= range) {
      for (let i = 1; i <= range + 1; i++) {
        arr.push(i);
      }
      return [...arr, total];
    } else if (total - current <= range) {
      for (let i = total - range; i <= total; i++) {
        arr.push(i);
      }
      return [1, ...arr];
    } else if (current < total) {
      for (let i = current - center; i <= current + center; i++) {
        arr.push(i);
      }
      return [1, ...arr, total];
    } else return [];
  }

  const [page, setPage] = useState<number>(current || 1);

  const onClick = async (pageNum: number) => {
    await onChange(pageNum);
    setPage(pageNum);
  };

  const next = async () => {
    if (page + 1 > numOfPages) {
      return setPage(numOfPages);
    }
    await onChange(page + 1);
    return setPage(page + 1);
  };

  const back = async () => {
    if (page - 1 < 1) {
      return setPage(1);
    }
    await onChange(page - 1);
    return setPage(page - 1);
  };

  const paginationArr = paginate(numOfPages, range, page);
  const pagination =
    paginationArr.length > 0 &&
    paginationArr.map((num, idx) => {
      return (
        <button
          key={idx}
          className={page === num ? "current" : ""}
          onClick={() => onClick(num)}
        >
          {num}
        </button>
      );
    });
  return (
    <div className="paginate">
      <style jsx global>
        {`
          .paginate {
            display: flex;
            flex-direction: row;
          }

          .paginate button {
            background: #cdbcde;
            outline: none;
            cursor: pointer;
            border: 1px solid;
          }

          .paginate button:active {
            outline: none;
          }

          .paginate .current {
            background: white;
          }

          .paginate button {
            padding: 0.5rem;
          }
        `}
      </style>
      <button onClick={back}>Back</button>
      {pagination}
      <button onClick={next}>Next</button>
    </div>
  );
}
