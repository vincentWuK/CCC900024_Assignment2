import React, {useState} from 'react';
import { Layout, Typography, Space, Menu, Breadcrumb, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import Chart from 'react-google-charts';
import { available } from './Util';
import { request_sentiment_analysis } from './FetchData';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function T1_GA() {

  let navigate = useNavigate();

  const [t1Date, setT1Date] = useState({from_date:'', to_date:''});
  function onChange(t1Dates, t1DateStrings) {
    const newT1Dates = {...t1Dates}
    newT1Dates['from_date'] = t1DateStrings[0]
    newT1Dates['to_date'] = t1DateStrings[1]
    setT1Date(newT1Dates)
  }

  function submit(e) {
    request_sentiment_analysis(t1Date).then((response) => setT1Test(response))
  }
  
  const [t1Test, setT1Test] = useState({})

  function generateOptions(title, subtitle) {
    return {
      chart: {
        title: "Suburb Name: " + title,
        subtitle: "Moods Changing in Suburb " + subtitle + " During the Given Dates Period ",
      },
    }
  }

  function t1List(suburbMood) {
    var table = []
    table.push(["date", "very positive", "positive", "neutral", "negative", "very negative"])
    var dates = []
    var temp_key = Object.keys(suburbMood)[0]
    
    for (const i in suburbMood[temp_key]) {
      dates.push(suburbMood[temp_key][i].date)
    }

    var moods = ["very positive", "positive", "neutral", "negative", "very negative"]

    for (const i in dates) {
      var mood_row = [dates[i]]
      for (const j in moods) {
        var value = -1;
        for (const k in suburbMood[moods[j]]) {
          if (suburbMood[moods[j]][k].date === dates[i]) {
            value = suburbMood[moods[j]][k].value
            break
          }
        }
        mood_row.push(value)
      }
      table.push(mood_row)
    }
    return table
  }

  const [selectSuburb, setSelectSuburb] = useState([]);
  function handleCity(value) {
    const selectSuburbs = (`${value}`).split(',');
    setSelectSuburb(selectSuburbs)
    console.log(selectSuburbs)
    setT1Test(t1Test)
  }

  return (
    <div className="Plot1">
      <Layout>
        <Header style={{padding:10, textAlign: 'center'}}>
          <Space direction="vertical">
            <Title level={3} style = {{color:'white'}}>{available(t1Test) ? JSON.stringify(t1Test) : String(t1Test)}</Title>
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
                title = {<span>Multi Culture Analysis</span>}>
                <Menu.ItemGroup>

                  <Menu.Item>
                    <Space direction="vertical" size={12}>
                      <RangePicker
                        ranges={{
                          Today: [moment(), moment()],
                          'This Month': [moment().startOf('month'), moment().endOf('month')],
                        }}
                        onChange={onChange}
                      />
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
                    <Button type="link" style={{marginLeft: "-10px"}} onClick={() => {navigate('/T2o') }}>
                      Topic 2 Unemployment Overview
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "10px"}} onClick={() => {navigate('/T2_GA') }}>
                      Topic 2 Graph Analysis
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
                  placeholder="Please Select Suburb(s)"
                  onChange={handleCity}
                  optionFilterProp="children">
                  <Select value="Melbourne">Melbourne</Select>
                  <Select value="Carlton">Carlton</Select>
                  <Select value="Docklands">Docklands</Select>
                  <Select value="East Melbourne">East Melbourne</Select>
                  <Select value="Kensington">Kensington</Select>
                  <Select value="North Melbourne">North Melbourne</Select>
                  <Select value="Parkville">Parkville</Select>
                  <Select value="Port Melbourne">Port Melbourne</Select>
                  <Select value="Southbank">Southbank</Select>
                  <Select value="South Yarra">South Yarra</Select>
                  <Select value="West Melbourne">West Melbourne</Select>
                </Select>
                
              
                { available(t1Test) && Object.keys(t1Test).map((suburb) => {if (selectSuburb.includes(suburb)) {
                  return (
                    <div style={{marginTop: 24, padding: 10, width: "950px", backgroundColor: 'white'}}>
                      <Chart
                      chartType="Line"
                      data={t1List(t1Test[suburb])}
                      width="930px"
                      height="250px"
                      options={generateOptions(suburb,suburb)}
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

export default T1_GA