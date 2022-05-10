import React, {useState} from 'react';
import { Layout, Typography, Space, Menu, Breadcrumb, Select, DatePicker, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import Chart from 'react-google-charts';
import { available } from './Util';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function T2_GA() {

  let navigate = useNavigate();

  const [t2Date, setT2Date] = useState({from_date:'', to_date:''});
  function onChange(t2Dates, t2DateStrings) {
    const newT2Dates = {...t2Dates}
    newT2Dates['from_date'] = t2DateStrings[0]
    newT2Dates['to_date'] = t2DateStrings[1]
    setT2Date(newT2Dates)
  }

  function submit(e) {
    // TO DO
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
        <Header style={{padding:10, textAlign: 'center'}}>
          <Space direction="vertical">
            <Title level={3} style = {{color:'white'}}>CCC assignment Group 11</Title>
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
              <Menu.Item key = 'Dashborad'>
                Dashboard
              </Menu.Item>
              <SubMenu
                title = {<span>Unemployment Analysis</span>}>
                <Menu.ItemGroup>

                  {/* <Menu.Item style={{ height: '50%'}}>
                    <Select
                      mode='multiple'
                      showSearch
                      placeholder="Select Age Groups"
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                    >
                      <Select value="<10">Less than 10</Select>
                      <Select value="10-15">10-15</Select>
                      <Select value="15-20">15-20</Select>
                      <Select value="20-25">20-25</Select>
                      <Select value="25-30">25-30</Select>
                      <Select value="35-40">35-40</Select>
                      <Select value="45-50">45-50</Select>
                      <Select value="55-60">55-60</Select>
                      <Select value="65-70">65-70</Select>
                      <Select value="75-80">75-80</Select>
                      <Select value="80+">80+</Select>
                    </Select>
                  </Menu.Item> */}

                  <Menu.Item>
                    <Space direction="vertical" size={12}>
                      <RangePicker />
                    </Space>
                  </Menu.Item>

                  <Button onClick={submit} type="primary" style={{marginLeft: "115px"}}>Submit</Button>
            
                </Menu.ItemGroup>
              </SubMenu>
              <SubMenu title = {<span>Related Pages</span>}>
                <Menu.ItemGroup>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "35px"}} onClick={() => {navigate('/') }}>
                      -- Home Page --
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "10px"}} onClick={() => {navigate('/T1_GA') }}>
                      Topic 1 Graph Analysis
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "-10px"}} onClick={() => {navigate('/T2o') }}>
                      Topic 2 Unemployment Overview
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "40px"}} onClick={() => {navigate('/Others') }}>
                      -- Others  -- 
                    </Button>
                  </Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Content style={{ padding: 90, minHeight: 500, marginTop: -105  }}>           
            <Breadcrumb style={{ margin: '16px' }}>
              <div style={{ padding: 24, minHeight: 450 }}>
                <Select
                  mode="multiple"
                  showArrow
                  style={{ width: '112%'}}
                  showSearch
                  placeholder="Please Select City(s)"
                  onChange={handleCity}
                  optionFilterProp="children">
                  <Select value="adelaide">Adelaide</Select>
                  <Select value="brisbane">Brisbane</Select>
                  <Select value="sydney">Sydney</Select>
                </Select>
                
              
                { available(t2Test) && Object.keys(t2Test).map((city) => {if (selectCity.includes(city)){
                  return (
                    <div style={{marginTop: 24, padding: 10, width: "950px", backgroundColor: 'white'}}>
                      <Chart
                      chartType="Bar" // Change chartType into Line
                      data={t2List(t2Test[city])}
                      width="930px"
                      height="250px"
                      options={generateOptions(city,city)}
                      legendToggle
                    />
                  </div>
                  )
                }})}

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