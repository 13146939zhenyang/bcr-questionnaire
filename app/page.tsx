'use client'
import React, { useEffect, FC, useState } from 'react'
import { Button, Radio, Form, Input, message, Spin, ConfigProvider, Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BASE_URL } from '../utils/path';
import axios from 'axios'
import { useDebounce } from 'react-use';
import { sendVerificationCode } from '../utils'
import { LoadingOutlined } from '@ant-design/icons';
import { LogoWhite } from '../public'
import type { RadioChangeEvent } from 'antd';
import { preferActivities, major, experience } from '@/utils/questions'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />;
const antIcon1 = <LoadingOutlined style={{ fontSize: 12 }} spin rev={undefined} />;

const Landing = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState('');
  const [usernameFormat, setUsernameFormat] = useState<boolean | null>(null)
  const [email, setEmail] = useState('');
  const [emailFormat, setEmailFormat] = useState<boolean | null>(null)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [inputVerificationCode, setInputVerificationCode] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [selectedMajor, setSelectedMajor] = useState<string>()
  const [haveExperience, setHaveExperience] = useState<boolean>(false)
  const [selectedExperience, setSelectedExperience] = useState<string>()
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  // function submitForm
  const onFinish = async (values: any) => {
    setLoading(true)
  }
  const onFinishFailed = () => {
    message.warning('Please fill in the form!')
  };
  // debouncer to check username
  const [, cancel] = useDebounce(
    () => {
      setIsUsernameAvailable(null);
      // call api to check username avaliability
      const checkUsername = async () => {
        try {
          // check phone number has been registered or not
          const { data } = await axios.get(`${BASE_URL}/api/auth/check/username?username=${username}`)
          if (data.data.available === true) {
            setIsUsernameAvailable(true);
          } else {
            setIsUsernameAvailable(false);
          }
        }
        catch (err) {
          console.log(err)
        }
      }
      username !== '' && usernameFormat === true && checkUsername();
    },
    500,
    [username]
  );
  const [sendLoading, setSendLoading] = useState<boolean>(false)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(60)
  const handleSendVerficationCode = async () => {
    setSendLoading(true)
    setButtonLoading(true)
    const data = await sendVerificationCode(setVerificationCode, username, 'phone')
    if (data.data.send) {
      message.success(data.message)
      setSendLoading(false)
      // loading, disabled the button for 60s
      let c = count;
      const interval = setInterval(() => {
        c--;
        setCount(c)
        if (c === 0) {
          clearInterval(interval);
          setButtonLoading(false)
          setCount(60)
        }
      }
        , 1000);
    }
  }
  const onChangeMajor = (e: RadioChangeEvent) => {
    setSelectedMajor(e.target.value);
  };
  const onChangeHaveExperience = (e: RadioChangeEvent) => {
    setHaveExperience(e.target.value);
  };
  const onChangeExperience = (e: RadioChangeEvent) => {
    setSelectedExperience(e.target.value);
  };

  const onChangeActivities = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              colorPrimary: '#FAD403',
              colorText: 'white',
              lineHeight: 2.3,
            },
            Checkbox: {
              colorPrimary: '#FAD403',
              colorText: 'white',
              lineHeight: 2.3,
              borderRadiusSM: 14
            },
            Input: {
              colorBgContainer: 'rgba(0, 0, 0, 0.04)',
              colorText: 'white',
              colorPrimaryHover: '#FAD403',
            },
            Button: {
              colorBgTextHover: '#FAD403',
              colorBgTextActive: '#FAD403',
              colorErrorBorderHover: '#FAD403',
              colorPrimaryBorder: '#FAD403',
              colorPrimaryHover: '#FAD403',
            },
          },
        }}
      >
        <Form
          name="landing_signup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
          className="w-[800px] mx-2 p-10 rounded-xl shadow-xl bg-[#070B10] backdrop-blur-sm backdrop-filter bg-opacity-40 text-white "
        >
          <div className=''>
            <div className='mb-5'>
              <img src={LogoWhite.src} alt="" className='w-[140px] z-10 drop-shadow-xl' />
            </div>
            <div className='ml-2'>
              <div className='flex flex-col gap-2 mb-2'>
                <div className='shadow-text'>
                  <span>Full Name</span>
                </div>
                <Form.Item name="name" className='my-0' rules={[{ required: true, message: 'Please input name!' }]}>
                  <Input
                    size='middle'
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }
                    }
                    value={name}
                  />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2 mb-2'>
                <div className='shadow-text'>
                  <span>Email</span>
                </div>
                <Form.Item
                  name="email"
                  required
                  rules={[
                    { required: true, message: 'Please input email!' },
                    {
                      validator(rule, value, callback) {
                        if (value) {
                          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                          if (emailRegex.test(value)) {
                            callback();
                            setEmailFormat(true);
                          }
                          else {
                            setEmailFormat(false)
                            callback('Please input a valid email format!');
                          }
                        } else {
                          setEmailFormat(null)
                          callback();
                        }
                      }
                    }
                  ]}
                  className='my-0'
                >
                  <Input
                    size='middle'
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }
                    }
                    value={username}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='ml-2 flex flex-col gap-2'>
              <div className='shadow-text'>
                <span>Phone</span>
              </div>
              <div className='flex flex-col gap-2 mb-2'>
                <div className='relative'>
                  <Form.Item
                    name="username"
                    required
                    rules={[
                      { required: true, message: 'Please input phone!' },
                      {
                        validator(rule, value, callback) {
                          if (value) {
                            const phoneRegex = /^[0-9]{9,10}$/;
                            if (phoneRegex.test(value)) {
                              callback();
                              setUsernameFormat(true);
                            }
                            else {
                              setUsernameFormat(false)
                              callback('Please input a valid phone format!');
                            }
                          } else {
                            setUsernameFormat(null)
                            callback();
                          }
                        }
                      }
                    ]}
                    className='my-0'
                  >
                    <Input
                      size='middle'
                      onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }
                      }
                      value={username}
                    />
                  </Form.Item>
                  {username && isUsernameAvailable !== null && isUsernameAvailable === false && <div className='absolute bottom-0 text-red-500'>Phone has been registered</div>}
                  {username && isUsernameAvailable !== null && isUsernameAvailable === true && <div className='absolute bottom-0 text-green-500'>Phone is available</div>}
                </div>
                <div className='shadow-text'>Verification Code</div>
                <Form.Item
                  name="verificationCode"
                  rules={[{ required: true, message: 'Please input verfication code!' }]}
                  className=""
                >
                  <Input
                    addonAfter={
                      <button
                        disabled={buttonLoading}
                        className=''
                        onClick={isUsernameAvailable === true ?
                          (e) => { e.preventDefault(); handleSendVerficationCode() }
                          :
                          (e) => { e.preventDefault(); message.warning('Please provide an available phone!') }}
                      >
                        {sendLoading ? <Spin indicator={antIcon1} /> :
                          (buttonLoading ? `${count} s` : 'CODE')}
                      </button>
                    }
                    size='middle'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVerificationCode(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='ml-2'>
              <div className='shadow-text'>
                <span>Major:</span>
              </div>
              <Form.Item name='major' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Radio.Group onChange={onChangeMajor} value={selectedMajor}>
                  {major.map((item, index) => (
                    <Radio key={index} value={item.value} className='text-white'>
                      {item.title}
                      <>{selectedMajor === 'other' && item.value ==='other' ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}</>
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
            <div className='ml-2'>
              <div className='shadow-text'>
                <span>Do you have investment experience?</span>
              </div>
              <Form.Item name='experience' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Radio.Group onChange={onChangeHaveExperience} value={haveExperience}>
                  <Radio value={true} className='text-white'>
                    Yes
                  </Radio>
                  <Radio value={false} className='text-white'>
                    No
                  </Radio>
                  {haveExperience === true ? (
                    <Form.Item name='experienceDetail' required className='' rules={[{ required: true, message: 'Please input!' }]}>
                      <Radio.Group onChange={onChangeExperience} value={selectedExperience}>
                        {experience.map((item, index) => (
                          <Radio key={index} value={item.value} className='text-white'>
                            {item.title}<>{selectedExperience === 'other' && item.value==='other' ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}</>
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  ) : null}
                </Radio.Group>
              </Form.Item>
            </div>
            <div className='ml-2'>
              <div className='shadow-text'>
                <span>Which types of offline activities would you like to participate in?</span>
              </div>
              <Form.Item name='activities' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Checkbox.Group options={preferActivities} onChange={onChangeActivities} className='text-white' />
              </Form.Item>
            </div>
            <Form.Item className='flex justify-center'>
              <Button
                htmlType="submit"
                disabled={loading}
                className='bg-[#FFB800] text-black w-[200px] h-[40px] rounded-[20px] hover:text-[#FFB800] hover:bg-[#00000000]'
              >
                {!loading ? 'Submit' : <Spin indicator={antIcon} />}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </ConfigProvider>
    </>
  );
}

export default Landing
