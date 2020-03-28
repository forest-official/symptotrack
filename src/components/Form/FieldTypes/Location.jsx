import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import ReactSelect from 'react-select';

// Utils
import { useDebounce } from '../../../utils';

// Components
import FieldHeader from './FieldHeader';
import Icon from '../../Icon';
import Tooltip from '../../General/Tooltip';
import { MyLocation } from '../../Map';

// Styling
import { Box, Button, Flex, Text } from '../../styles';
import { SLocation, SSelect } from './styles';

const Location = forwardRef(({ name, translation, error, width, placeholder, setValue }, ref) => {
  const [isLoading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getLocation = async (query) => {
    const provider = new OpenStreetMapProvider();

    // search
    const results = await provider.search({ query });
    setSuggestions(results);
    setLoading(false);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      getLocation(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Flex mb={30} mt={[15, 0]} width={[1, 2 / 3]} flexDirection="column">
      {(translation?.question || translation?.description) && (
        <FieldHeader
          name={name}
          question={translation?.question}
          description={translation?.description}
        />
      )}
      {translation?.tooltip && (
        <Tooltip question={translation.tooltip.question} answer={translation.tooltip.answer} />
      )}
      <Box width={width}>
        <Box mb={40}>
          <SLocation>
            <ReactSelect
              isSearchable
              options={suggestions}
              onInputChange={(e) => setSearchTerm(e)}
              onChange={({ x, y }) => {
                setLocation([y, x]);
                setValue(name, [y, x]);
              }}
              styles={SSelect}
              placeholder={translation?.placeholder || placeholder}
              isLoading={isLoading}
            />
            <input type="hidden" name={`${name}[0]`} ref={ref} value={location?.[0]} />
            <input type="hidden" name={`${name}[1]`} ref={ref} value={location?.[1]} />
            <Button type="button">
              <Icon icon="SEARCH" viewBox="0 0 512 512" color="white" size={15} />
            </Button>
          </SLocation>
        </Box>
        {location && <MyLocation position={location} newLocation={setLocation} />}
      </Box>
      {error?.[0] && (
        <Text mt={10} fontSize={12}>
          {error[0].message}
        </Text>
      )}
    </Flex>
  );
});

Location.propTypes = {
  name: PropTypes.string.isRequired,
  translation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  placeholder: PropTypes.string,
};

Location.defaultProps = {
  translation: null,
  error: false,
  width: 1,
  placeholder: ' ',
};

export default Location;
