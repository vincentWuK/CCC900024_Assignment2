import React, { useState } from 'react';
import { Layout, Typography, Space, Menu, Breadcrumb, Select, DatePicker, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import Chart from 'react-google-charts';
import file2020 from './dese_gcc_summary_data_dec_2020-1574662667975838006.json';
import file2021 from './dese_gccsa_summary_data_dec_2021-5538471449058000739.json';
import { available } from './Util';
import { request_daily_sent_city } from './FetchData';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function T2_GA() {

  let navigate = useNavigate();

  const [t2Date, setT2Date] = useState({ from_date: '', to_date: '' });
  function onChange(t2Dates, t2DateStrings) {
    const newT2Dates = { ...t2Date }
    newT2Dates['from_date'] = t2DateStrings[0]
    newT2Dates['to_date'] = t2DateStrings[1]
    setT2Date(newT2Dates)
  }

  function submit(e) {
    request_daily_sent_city(t2Date).then((response) => setT2Test(response))
  }
  function employ(data1, data2) {
    var employ2020 = []
    var employ2021 = []
    for (const i in data1.features) {
      employ2020.push(parseFloat(data1.features[i].properties.mpy_rt_15_64))
    }
    for (const j in data2.features) {
      employ2021.push(parseFloat(data2.features[j].properties.mpy_rt_15_64))
    }

    var empRate = []
    empRate.push(["city", "2020", "2021"])
    empRate.push(['Sydney',employ2020[0],employ2021[0]])
    empRate.push(['Melbourne',employ2020[1],employ2021[1]])
    empRate.push(['Brisbane',employ2020[2],employ2021[2]])
    empRate.push(['Adelaide',employ2020[3],employ2021[3]])
    return empRate
  }

  function unEmploy(data1, data2) {
    var unEmp2020 = []
    var unEmp2021 = []
    for (const i in data1.features) {
      unEmp2020.push(parseFloat(data1.features[i].properties.unemp_rt_15))
    }
    for (const j in data2.features) {
      unEmp2021.push(parseFloat(data2.features[j].properties.unemp_rt_15))
    }

    var unEmpRate = []
    unEmpRate.push(["city", "2020", "2021"])
    unEmpRate.push(['Sydney',unEmp2020[0],unEmp2020[0]])
    unEmpRate.push(['Melbourne',unEmp2020[1],unEmp2020[1]])
    unEmpRate.push(['Brisbane',unEmp2020[2],unEmp2020[2]])
    unEmpRate.push(['Adelaide',unEmp2020[3],unEmp2020[3]])
    return unEmpRate
  }

  const [t2Test, setT2Test] = useState({})

  function generateOptions(title, subtitle) {
    return {
      chart: {
        title: "City Name: " + title,
        subtitle: "Moods Changing in City " + subtitle + " During the Given Dates Period ",
      },
    }
  }

  function empOption(title) {
    return {
      chart: {
        title: title + " Changes between 2020 and 2021",
      },
    }
  }

  function t2List(cityMood) {
    var table = []
    table.push(["date", "very positive", "positive", "neutral", "negative", "very negative"])
    var dates = []
    var temp_key = Object.keys(cityMood)[0]

    for (const i in cityMood[temp_key]) {
      dates.push(cityMood[temp_key][i].date)
    }

    var moods = ["very positive", "positive", "neutral", "negative", "very negative"]

    for (const i in dates) {
      var mood_row = [dates[i]]
      for (const j in moods) {
        var value = -1;
        for (const k in cityMood[moods[j]]) {
          if (cityMood[moods[j]][k].date === dates[i]) {
            value = cityMood[moods[j]][k].value
            break
          }
        }
        mood_row.push(value)
      }
      table.push(mood_row)
    }
    return table
  }

  const [selectCity, setSelectCity] = useState([]);
  function handleCity(value) {
    const selectCitys = (`${value}`).split(',');
    setSelectCity(selectCitys)
    console.log(selectCitys)
    setT2Test(t2Test)
  }

  return (
    <div className="Plot1">
      <Layout>
        <Header style={{ padding: 10, textAlign: 'center' }}>
          <Space direction="vertical">
            <Title level={3} style={{ color: 'white' }}>CCC assignment Group 11</Title>
          </Space>
        </Header>
      </Layout>
      <Layout>
        <Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0, width: '150%' }}>
            <Menu.Item key='Dashborad'>
              Dashboard
            </Menu.Item>
            <SubMenu
              title={<span> AURIN Unemployment Analysis</span>}>
              <Menu.ItemGroup>
                <Menu.Item>
                  <Space direction="vertical" size={12}>
                    <RangePicker />
                  </Space>
                </Menu.Item>
                <Button onClick={submit} type="primary" style={{ marginLeft: "115px" }}>Submit</Button>
              </Menu.ItemGroup>
            </SubMenu>
            <SubMenu title={<span>Related Pages</span>}>
              <Menu.ItemGroup>
                <Menu.Item>
                  <Button type="link" style={{ marginLeft: "35px" }} onClick={() => { navigate('/') }}>
                    -- Home Page --
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button type="link" style={{ marginLeft: "10px" }} onClick={() => { navigate('/T1_GA') }}>
                    Topic 1 Graph Analysis
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button type="link" style={{ marginLeft: "-10px" }} onClick={() => { navigate('/T2o') }}>
                    Topic 2 AURIN Unemployment Overview
                  </Button>
                </Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Content style={{ padding: 90, minHeight: 500, marginTop: -105 }}>
            <Breadcrumb style={{ margin: '16px' }}>
              <div style={{ padding: 24, minHeight: 450 }}>
                <Select
                  mode="multiple"
                  showArrow
                  style={{ width: '112%' }}
                  showSearch
                  placeholder="Please Select City(s)"
                  onChange={handleCity}
                  optionFilterProp="children">
                  <Select value="adelaide">Adelaide</Select>
                  <Select value="brisbane">Brisbane</Select>
                  <Select value="sydney">Sydney</Select>
                </Select>


                {available(t2Test) && Object.keys(t2Test).map((city) => {
                  if (selectCity.includes(city)) {
                    return (
                      <div style={{ marginTop: 24, padding: 10, width: "950px", backgroundColor: 'white' }}>
                        <Chart
                          chartType="Bar" // Change chartType into Line
                          data={t2List(t2Test[city])}
                          width="930px"
                          height="250px"
                          options={generateOptions(city, city)}
                          legendToggle
                        />
                      </div>
                    )
                  }
                })}
                <div style={{marginTop: 24, padding: 10, width: "950px", backgroundColor: 'white'}}>
                  <Chart
                    chartType="Bar" 
                    data={employ(file2020,file2021)}
                    width="930px"
                    height="250px"
                    options={empOption('Employment Rate')}
                    legendToggle
                  />
                </div>

                <div style={{marginTop: 24, padding: 10, width: "950px", backgroundColor: 'white'}}>
                  <Chart
                    chartType="Bar" 
                    data={unEmploy(file2020,file2021)}
                    width="930px"
                    height="250px"
                    options={empOption('Unemployment Rate')}
                    legendToggle
                  />
                </div>
              </div>
            </Breadcrumb>
          </Content>
          <Footer style={{ textAlign: 'center' }}>CCC assignment2 group 11</Footer>
        </Layout>

      </Layout>
    </div>
  )
}

export default T2_GA