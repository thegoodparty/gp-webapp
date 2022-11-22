/**
 *
 * ApplicationStep1
 *
 */

 import React, { useState, useEffect } from 'react';
 import PropTypes from 'prop-types';
 import styled from 'styled-components';
 
 import ApplicationWrapper from './ApplicationWrapper';
 import { Body, Body13 } from '../../shared/typogrophy';
 import BlackCheckbox from '../../shared/BlackCheckbox';
 import { APPLICATION_CARDS_1 } from './fields';
 
 export const Title = styled.h1`
   font-size: 21px;
   margin: 0 0 32px;
   @media only screen and (min-width: ${({ theme }) =>
       theme.breakpointsPixels.md}) {
     font-size: 36px;
   }
 `;
 
 const SubTitle = styled(Body)`
   margin-bottom: 24px;
   color: #000;
   @media only screen and (min-width: ${({ theme }) =>
       theme.breakpointsPixels.md}) {
     margin-bottom: 36px;
   }
 `;
 
 const Card = styled.div`
   background-color: #f9f9f9;
   border-radius: 8px;
   padding: 16px;
   margin-bottom: 8px;
 `;
 
 const CardTitle = styled(Body)`
   font-weight: 600;
   color: #000;
   text-transform: uppercase;
   display: flex;
   align-items: center;
   margin-bottom: 8px;
 `;
 
 const CardSubtitle = styled(Body13)`
   font-weight: 500;
   margin-bottom: 28px;
 `;
 
 const Icon = styled.img`
   margin-right: 16px;
 `;
 
 const CheckboxWrapper = styled(Body13)`
   display: flex;
   align-items: flex-start;
   margin-bottom: 16px;
 `;
 
 function ApplicationStep1({
   step,
   application,
   updateApplicationCallback,
   reviewMode,
   standAlone,
   standAloneCanSubmitCallback = () => {},
 }) {
   const [state, setState] = useState({
     disAffiliate: false,
     notJoin: false,
     noPay: false,
 
     alternative: false,
     fundraising: false,
     nopartisan: false,
 
     honest: false,
     transparent: false,
     choices: false,
   });
 
   useEffect(() => {
     if (application?.pledge) {
       setState({
         ...application.pledge,
       });
     }
   }, [application]);
 
   const onChangeField = (key, value) => {
     const updatedState = {
       ...state,
       [key]: value,
     };
     setState(updatedState);
     const isCompleted =
       updatedState.disAffiliate &&
       updatedState.notJoin &&
       updatedState.noPay &&
       updatedState.alternative &&
       updatedState.fundraising &&
       updatedState.nopartisan &&
       updatedState.honest &&
       updatedState.transparent &&
       updatedState.choices;
 
     updateApplicationCallback(application.id, {
       ...application,
       pledge: {
         ...updatedState,
         isCompleted,
       },
     });
     standAloneCanSubmitCallback(isCompleted);
   };
 
   const canSubmit = () =>
     state.disAffiliate &&
     state.notJoin &&
     state.noPay &&
     state.alternative &&
     state.fundraising &&
     state.nopartisan &&
     state.honest &&
     state.transparent &&
     state.choices;
 
   const WrapperElement = ({ children }) => {
     if (standAlone) {
       return <div>{children}</div>;
     } else {
       return (
         <ApplicationWrapper
           step={step}
           canContinue={canSubmit()}
           id={application.id}
           reviewMode={reviewMode}
           standAlone={standAlone}
         >
           {children}
         </ApplicationWrapper>
       );
     }
   };
   return (
     <WrapperElement>
       <Title data-cy="step-title">
         {!standAlone && 'Step 1: '}Take the Good Party Pledge to get started
       </Title>
       <SubTitle data-cy="step-subtitle">
         Good Party candidates take a pledge to be{' '}
         <strong>Honest, Independent and People-Powered</strong>.
       </SubTitle>
       {APPLICATION_CARDS_1.map((card) => (
         <Card key={card.title} data-cy="step-card">
           <CardTitle data-cy="step-card-title">
             {card.icon}
             {card.title}
           </CardTitle>
           <CardSubtitle data-cy="step-card-subtitle">
             {card.subtitle}
           </CardSubtitle>
           {card.checkboxes.map((item) => (
             <CheckboxWrapper key={item.id} data-cy="card-checkbox">
               <BlackCheckbox
                 value={state[item.id]}
                 onChange={(e) => onChangeField(item.id, e.target.checked)}
                 disabled={reviewMode}
                 data-cy="card-check-box"
               />
               <div dangerouslySetInnerHTML={{ __html: item.text }} />
             </CheckboxWrapper>
           ))}
         </Card>
       ))}
     </WrapperElement>
   );
 }
 
 ApplicationStep1.propTypes = {
   step: PropTypes.number,
   application: PropTypes.object,
   updateApplicationCallback: PropTypes.func,
 };
 
 export default ApplicationStep1;
 