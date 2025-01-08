import { FormModal, Icon } from '@lobehub/ui';
import type { FormItemProps } from '@lobehub/ui/es/Form/components/FormItem';
import { App, Input, Radio } from 'antd';
import { BrainIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useAiInfraStore } from '@/store/aiInfra/store';
import { CreateAiProviderParams } from '@/types/aiProvider';

import { KeyVaultsConfigKey, LLMProviderApiTokenKey, LLMProviderBaseUrlKey } from '../../const';

interface CreateNewProviderProps {
  onClose?: () => void;
  open?: boolean;
}

const CreateNewProvider = memo<CreateNewProviderProps>(({ onClose, open }) => {
  const { t } = useTranslation('modelProvider');
  const [loading, setLoading] = useState(false);
  const createNewAiProvider = useAiInfraStore((s) => s.createNewAiProvider);
  const { message } = App.useApp();
  const router = useRouter();
  const onFinish = async (values: CreateAiProviderParams) => {
    setLoading(true);

    try {
      await createNewAiProvider(values);
      setLoading(false);
      router.push(`/settings/provider/${values.id}`);
      message.success(t('createNewAiProvider.createSuccess'));
      onClose?.();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const basicItems: FormItemProps[] = [
    {
      children: (
        <Input autoFocus placeholder={t('createNewAiProvider.id.placeholder')} variant={'filled'} />
      ),
      desc: t('createNewAiProvider.id.desc'),
      label: t('createNewAiProvider.id.title'),
      minWidth: 400,
      name: 'id',
      rules: [
        { message: t('createNewAiProvider.id.required'), required: true },
        {
          message: t('createNewAiProvider.id.format'),
          pattern: /^[_a-z-]+$/,
        },
      ],
    },
    {
      children: (
        <Input placeholder={t('createNewAiProvider.name.placeholder')} variant={'filled'} />
      ),
      label: t('createNewAiProvider.name.title'),
      minWidth: 400,
      name: 'name',
      rules: [{ message: t('createNewAiProvider.name.required'), required: true }],
    },
    {
      children: (
        <Input.TextArea
          placeholder={t('createNewAiProvider.description.placeholder')}
          style={{ minHeight: 80 }}
          variant={'filled'}
        />
      ),
      label: t('createNewAiProvider.description.title'),
      minWidth: 400,
      name: 'description',
    },
    {
      children: <Input allowClear placeholder={'https://logo-url'} variant={'filled'} />,
      label: t('createNewAiProvider.logo.title'),
      minWidth: 400,
      name: 'logo',
    },
  ];

  const configItems: FormItemProps[] = [
    {
      children: (
        <Radio.Group
          options={[
            { label: 'OpenAI', value: 'openai' },
            { label: 'Anthropic', value: 'anthropic' },
          ]}
        />
      ),
      label: t('createNewAiProvider.sdkType.title'),
      name: 'sdkType',
      rules: [{ message: t('createNewAiProvider.sdkType.required'), required: true }],
    },
    {
      children: (
        <Input.Password
          autoComplete={'new-password'}
          placeholder={t('createNewAiProvider.apiKey.placeholder')}
          variant={'filled'}
        />
      ),
      label: t('createNewAiProvider.apiKey.title'),
      minWidth: 400,
      name: [KeyVaultsConfigKey, LLMProviderApiTokenKey],
      rules: [{ message: t('createNewAiProvider.apiKey.required'), required: true }],
    },
    {
      children: <Input allowClear placeholder={'https://xxxx-proxy.com/v1'} variant={'filled'} />,
      desc: t('createNewAiProvider.proxyUrl.placeholder'),
      label: t('createNewAiProvider.proxyUrl.title'),
      minWidth: 400,
      name: [KeyVaultsConfigKey, LLMProviderBaseUrlKey],
    },
  ];

  return (
    <FormModal
      destroyOnClose
      items={[
        {
          children: basicItems,
          title: t('createNewAiProvider.basicTitle'),
        },
        {
          children: configItems,
          title: t('createNewAiProvider.configTitle'),
        },
      ]}
      maxHeight={'90%'}
      onCancel={onClose}
      onFinish={onFinish}
      open={open}
      scrollToFirstError={{ behavior: 'instant', block: 'end', focus: true }}
      submitLoading={loading}
      submitText={t('createNewAiProvider.confirm')}
      title={
        <Flexbox gap={8} horizontal>
          <Icon icon={BrainIcon} />
          {t('createNewAiProvider.title')}
        </Flexbox>
      }
    />
  );
});

export default CreateNewProvider;