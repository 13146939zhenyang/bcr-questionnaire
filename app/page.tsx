'use client'
import React, { useEffect, FC, useState } from 'react'
import Head from 'next/head'
import { Button, Radio, Form, Input, message, Spin, ConfigProvider } from 'antd';
import { BASE_URL } from '../utils/path';
import axios from 'axios'
import { useDebounce } from 'react-use';
import { sendVerificationCode } from '../utils'
import { LoadingOutlined } from '@ant-design/icons';
import { Logo } from '../public'
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
  const onChangeExperience = (e: RadioChangeEvent) => {
    setSelectedExperience(e.target.value);
  };
  const onChangeActivities = (e: RadioChangeEvent) => {
    setSelectedActivities(e.target.value);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              colorPrimary: '#00b96b',
              colorText: 'white',
              lineHeight: 2.3,
            },
            Checkbox: {
              colorPrimary: '#ff4d4f',
              colorText: 'white',
              lineHeight: 2.3,
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
          className="w-[800px] mx-2 px-4 rounded-xl shadow-xl bg-white backdrop-blur-sm backdrop-filter bg-opacity-80"
        >
          <div className=''>
            <div className=''>
              <div className=''>
                <div className={``}>
                  <img src={Logo.src} alt="" className='w-[140px] z-10 drop-shadow-xl' />
                </div>
              </div>
            </div>
            <div className=''>
              <div className=''>
                <div className=''>
                  <span>Full Name</span>
                </div>
                <Form.Item name="name" className='my-0 w-[160px]' rules={[{ required: true, message: 'Please input name!' }]}>
                  <Input
                    size='small'
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }
                    }
                    value={name}
                  />
                </Form.Item>
              </div>
              <div className=''>
                <div className=''>
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
                  className='w-[200px] my-0'
                >
                  <Input
                    size='small'
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }
                    }
                    value={username}
                  />
                </Form.Item>
              </div>
            </div>
            <div className=''>
              <div className=''>
                <span>Phone</span>
              </div>
              <div className=''>
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
                    className='w-[200px]'
                  >
                    <Input
                      size='small'
                      onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }
                      }
                      value={username}
                    />
                  </Form.Item>
                  {username && isUsernameAvailable !== null && isUsernameAvailable === false && <div className='absolute bottom-0 text-red-500'>Phone has been registered</div>}
                  {username && isUsernameAvailable !== null && isUsernameAvailable === true && <div className='absolute bottom-0 text-green-500'>Phone is available</div>}
                </div>
                <Form.Item
                  name="verificationCode"
                  rules={[{ required: true, message: 'Please input verfication code!' }]}
                  className="w-[140px]"
                >
                  <Input
                    addonAfter={
                      <button
                        disabled={buttonLoading}
                        className=''
                        onClick={isUsernameAvailable === true ?
                          (e) => { e.preventDefault(); handleSendVerficationCode() }
                          :
                          (e) => { e.preventDefault(); message.warning('Please provide an available username!') }}
                      >
                        {sendLoading ? <Spin indicator={antIcon1} /> :
                          (buttonLoading ? `${count} s` : 'CODE')}
                      </button>
                    }
                    style={{ width: '100%' }}
                    size="small"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVerificationCode(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className=''>
              <div className=''>
                <span>Major:</span>
              </div>
              <Form.Item name='edgeEvents' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                <Radio.Group onChange={onChangeMajor} value={selectedMajor}>
                  {major.map((item, index) => (
                    <Radio key={index} value={item.value}>
                      {item.title}
                    </Radio>
                  ))}
                </Radio.Group>
                <>{selectedMajor === 'other' ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}</>
              </Form.Item>
            </div>
            <div className=''>
              <div className=''>
                <span>Your current Trading Proficiency?</span>
              </div>
              <Form.Item name='tradingProficiency' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                {/* <Radio.Group options={tradingProficiency} onChange={onChangeProficiency} value={selectedTradingProficiency} /> */}
              </Form.Item>
            </div>
            <div className=''>
              <div className=''>
                <span>Where did you know about us?</span>
              </div>
              <Form.Item name='knowAboutUs' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                {/* <Radio.Group options={knowAboutUs} onChange={onChangeAboutUs} value={selectedKnowAboutUs} /> */}
              </Form.Item>
            </div>
            <div className=''>
              <div className=''>
                <span>An you hope to achieve:</span>
              </div>
              <Form.Item name='preferActivities' required className='' rules={[{ required: true, message: 'Please select!' }]}>
                {/* <Radio.Group options={preferActivities} onChange={onChangeAchieve} value={selectedAchieve} /> */}
              </Form.Item>
            </div>
            <Form.Item className=''>
              <Button
                htmlType="submit"
                className=""
                disabled={loading}
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
