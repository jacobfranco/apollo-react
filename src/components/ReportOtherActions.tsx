import { OrderedSet } from 'immutable';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { changeReportBlock, changeReportForward } from 'src/actions/reports';
import { fetchRules } from 'src/actions/rules';
import { Button, FormGroup, HStack, Stack, StatusCheckBox, Text, Toggle } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/hooks';

import type { Account } from 'src/schemas';

const messages = defineMessages({
  addAdditionalStatuses: { id: 'report.otherActions.addAdditional', defaultMessage: 'Would you like to add additional statuses to this report?' },
  addMore: { id: 'report.otherActions.addMore', defaultMessage: 'Add more' },
  furtherActions: { id: 'report.otherActions.furtherActions', defaultMessage: 'Further actions:' },
  hideAdditionalStatuses: { id: 'report.otherActions.hideAdditional', defaultMessage: 'Hide additional statuses' },
  otherStatuses: { id: 'report.otherActions.otherStatuses', defaultMessage: 'Include other statuses?' },
});

interface IOtherActionsStep {
  account: Account;
}

const OtherActionsStep = ({ account }: IOtherActionsStep) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const statusIds = useAppSelector((state) => OrderedSet(state.timelines.get(`account:${account.id}:with_replies`)!.items).union(state.reports.new.status_ids) as OrderedSet<string>);
  const isBlocked = useAppSelector((state) => state.reports.new.block);
  const isForward = useAppSelector((state) => state.reports.new.forward);
  const isSubmitting = useAppSelector((state) => state.reports.new.isSubmitting);

  const [showAdditionalStatuses, setShowAdditionalStatuses] = useState<boolean>(false);

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportBlock(event.target.checked));
  };

  const handleForwardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportForward(event.target.checked));
  };

  useEffect(() => {
    dispatch(fetchRules());
  }, []);

  return (
    <Stack space={4}>
        <Stack space={2}>
          <Text tag='h1' size='xl' weight='semibold'>
            {intl.formatMessage(messages.otherStatuses)}
          </Text>

          <FormGroup labelText={intl.formatMessage(messages.addAdditionalStatuses)}>
            {showAdditionalStatuses ? (
              <Stack space={2}>
                <div className='divide-y divide-solid divide-gray-200 dark:divide-gray-800'>
                  {statusIds.map((statusId) => <StatusCheckBox id={statusId} key={statusId} />)}
                </div>

                <div>
                  <Button
                    icon={require('@tabler/icons/arrows-minimize.svg')}
                    theme='tertiary'
                    size='sm'
                    onClick={() => setShowAdditionalStatuses(false)}
                  >
                    {intl.formatMessage(messages.hideAdditionalStatuses)}
                  </Button>
                </div>
              </Stack>
            ) : (
              <Button
                icon={require('@tabler/icons/plus.svg')}
                theme='tertiary'
                size='sm'
                onClick={() => setShowAdditionalStatuses(true)}
              >
                {intl.formatMessage(messages.addMore)}
              </Button>
            )}
          </FormGroup>
        </Stack>

      <Stack space={2}>
        <Text tag='h1' size='xl' weight='semibold'>
          {intl.formatMessage(messages.furtherActions)}
        </Text>

        <FormGroup
          labelText={<FormattedMessage id='report.block_hint' defaultMessage='Do you also want to block this account?' />}
        >
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={isBlocked}
              onChange={handleBlockChange}
              id='report-block'
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='report-block'>
              <FormattedMessage id='report.block' defaultMessage='Block {target}' values={{ target: `@${account.acct}` }} />
            </Text>
          </HStack>
        </FormGroup>
      </Stack>
    </Stack>
  );
};

export default OtherActionsStep;