import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

// Utils
import { get, post } from '../api/callers';
import { withTranslation } from '../i18n';
import { useApp } from '../contexts/AppProvider';
import { getLocale, parseValues } from '../utils';

// Components
import Hero from '../components/Hero';
import Form from '../components/Form';

// Styling
import { Box, Container, Row, Flex } from '../components/styles';

const Edit = ({ i18n, t, type, token }) => {
  const [data, setData] = useState(undefined);
  const { language } = i18n || {};
  const { translatedQuestionnaire, translatedErrors, basicQuestionnaireRecurring } = useApp();

  const getData = async (type, token) => {
    await get(`responses/${type}/${token}`).then((resp) => {
      setData(resp);
    });
  };

  useEffect(() => {
    if (type && token) {
      getData(type, token);
    }
  }, []);

  const prefillFormData = {};
  data &&
    Object.keys(data).map((answer) => {
      prefillFormData[answer] = parseValues(data[answer], true);
    });

  const onSubmit = async (data) => {
    const formData = {};

    Object.keys(data).map((answer) => {
      formData[answer] = parseValues(data[answer]);
    });

    formData.respondent_uuid = token;
    formData.locale = getLocale(language);

    await post('responses/basic', formData).then((resp) => {
      const { status, respondent_uuid } = resp || {};

      if (status === 400 || status === 504) {
        const { error } = resp?.data || {};
        console.log(error);
      } else {
        Router.push(`/thankyou?token=${respondent_uuid}`, '/bedankt');
      }
    });
  };

  return (
    <Container pb={70}>
      <Hero pt={[20, 40]} title={t('edit:title')} content={t('edit:content')} />
      <Row>
        <Flex justifyContent="center">
          <Box width={[1, 7 / 12]}>
            {data && (
              <Form
                form={basicQuestionnaireRecurring}
                translations={translatedQuestionnaire}
                translatedErrors={translatedErrors}
                onSubmit={onSubmit}
                prefill={prefillFormData}
              />
            )}
          </Box>
        </Flex>
      </Row>
    </Container>
  );
};

Edit.propTypes = {
  t: PropTypes.func.isRequired,
  type: PropTypes.string,
  token: PropTypes.string,
};

Edit.defaultProps = {
  type: null,
  token: null,
};

Edit.getInitialProps = async (ctx) => {
  const { type, token } = ctx.query;

  return { type, token, namespacesRequired: ['common', 'edit', 'socials'] };
};

export default withTranslation(['common', 'edit'])(Edit);
