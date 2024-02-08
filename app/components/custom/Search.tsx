import {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  onSearch: (value: string) => void
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Search({onSearch}: Props) {
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce(inputValue, 200);
  useEffect(() => {
    onSearch(debouncedInput)
  }, [debouncedInput])

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <TextField
        className={'!rounded-2xl'}
        size={"small"}
        value={inputValue}
        onChange={(event: any) => {
          handleChange(event)
        }}
        placeholder={'検索'}
        InputProps={{
          type: 'search',
          startAdornment: <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>,
        }}
      />
    </div>
  );
}

export default Search;
