import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Layout, Typography, Space, Menu, DatePicker, Button } from 'antd';
import moment from 'moment';
import { Modal, Row, Col } from 'react-bootstrap';
import { MapContainer as Map, TileLayer, Marker, Popup, LayersControl, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Chart from 'react-google-charts';
import { request_sentiment_analysis, request_tweets_proportion } from './FetchData'
import { available } from './Util';
import bar from './melbourne.json'; 

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function HomePage() {

  let navigate = useNavigate();

  const [homeDates, setHomeDates] = useState({from_date:'', to_date:''});

  const [lanTest, setlanTest] = useState({})
  
  const [moodTest, setmoodTest] = useState({})

  function onChange(homeDates, homeDateStrings) {
    const newHomeDates = {...homeDates}
    newHomeDates['from_date'] = homeDateStrings[0]
    newHomeDates['to_date'] = homeDateStrings[1]
    setHomeDates(newHomeDates)
  }

  function homeSubmit(e) {
    request_sentiment_analysis(homeDates).then((response) => setmoodTest(response))
    request_tweets_proportion(homeDates).then((response) => setlanTest(response))
  }
  
  function toLanList(suburbLang) {
    var table = [["language", "ratio"]]
    const langs = Object.keys(suburbLang)
    for (const i in langs) {
      table.push([langs[i], suburbLang[langs[i]]])
    }
    return table
  }

  function toLanMoodList(suburbMood, suburb) {
    var table = [["Suburb", "very positive", "positive", "neutral", "negative", "very negative"]]
    const moods = ["very positive", "positive", "neutral", "negative", "very negative"]
    var allMoods = [suburb]
    for (const i in moods) {
      allMoods.push(suburbMood[moods[i]])
    }
    table.push(allMoods)
    return table
  }

  const [suburbInfos, setsuburbInfos] = useState([
    {
      show: false,
      name: 'Melbourne' ,
      cord: [-37.813628, 144.963058],
      code: 'Melbourne',
      title: 'Melbourne Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Carlton' ,
      cord: [-37.8, 144.96667],
      code: 'Carlton',
      title: 'Carlton Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Docklands' ,
      cord: [-37.815018, 144.946014],
      code: 'Docklands',
      title: 'Docklands Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'East Melbourne',
      cord: [-37.816144, 144.980459],
      code: 'East Melbourne',
      title: 'East Melbourne Analysis within Given Time Period',

    },
    {
      show: false,
      name: 'Kensington' ,
      cord: [-37.7943498, 144.9301711],
      code: 'Kensington',
      title: 'Kensington Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'North Melbourne' ,
      cord: [-37.799167, 144.946667],
      code: 'North Melbourne',
      title: 'North Melbourne Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Parkville' ,
      cord: [-37.788, 144.951],
      code: 'Parkville',
      title: 'Parkville Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Port Melbourne' ,
      cord: [-37.823889, 144.911111],
      code: 'Port Melbourne',
      title: 'Port Melbourne Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Southbank' ,
      cord: [-37.8253925, 144.963577666524],
      code: 'Southbank',
      title: 'Southbank Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'South Yarra' ,
      cord: [-37.84, 144.989],
      code: 'South Yarra',
      title: 'South Yarra Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'West Melbourne' ,
      cord: [-37.81014000, 144.92],
      code: 'West Melbourne',
      title: 'West Melbourne Analysis within Given Time Period',
    },
  ])

  function setInfoShow (code, value) {
    const infoCopy = [...suburbInfos]
    for (const i in infoCopy) {
      if (infoCopy[i].code === code ) {
        infoCopy[i].show = value
        break
      }
    }
    setsuburbInfos (infoCopy)
  }

  function generateLayer (info) {
    return (
      <LayersControl.Overlay name= {info.name}>
        <Marker position={info.cord}>
          <Popup>
            <Button type="primary" onClick={() => setInfoShow(info.code,true)}>
              More Details
            </Button> 
            <Modal show={info.show} onHide={() => setInfoShow(info.code,false)} size= 'lg'>
              <Modal.Header closeButton>
                <Modal.Title>{info.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col xs={12} md={7}>
                    { Object.keys(lanTest).includes(info.code) &&
                      (<Chart
                        chartType="PieChart"
                        data={toLanList(lanTest[info.code])}
                        width="450px"
                        height="250px"
                        legendToggle
                        options={{
                          title: 'Languages Analysis',
                          pieHole: 0.3,
                        }}
                      />)
                    }
                    </Col>
                    <Col xs={6} md={5}>
                      { Object.keys(moodTest).includes(info.code) &&
                        (<Chart
                          chartType="ColumnChart"
                          data={toLanMoodList(moodTest[info.code], info.code)}
                          width="300px"
                          height="250px"
                          options={{
                            title: 'Moods Analysis',
                            isStacked: true,
                            height: 260,
                            legend: {position: 'top', maxLines: 3},
                            vAxis: {minValue: 0}
                          }}
                        />)
                      }
                  </Col>
                </Row>                                   
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setInfoShow(info.code,false)}>Close</Button>
              </Modal.Footer>  
            </Modal> 
          </Popup>
        </Marker>
      </LayersControl.Overlay>
    )
  }



  return (
    <div className='HomePage'>
      <Layout>
        <Header style={{padding:10, textAlign: 'center'}}>
          <Space direction="vertical">
            <Title level={3} style = {{color:'white'}}>CCC assignment Group 11</Title>
          </Space>  
        </Header>
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

              <SubMenu title = { <span>Topic 1: Multi Culture Overview</span> }>


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
                  <Button onClick={ homeSubmit } type='primary' style={{marginLeft: "40%"}}>Submit</Button>

              </SubMenu>

              <SubMenu title = {<span>Topic Plot Analysis</span>}>

                <Menu.ItemGroup>
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
                    <Button type="link" style={{marginLeft: "10px"}} onClick={() => {navigate('/T2_GA') }}>
                      Topic 2 Graph Analysis
                    </Button>
                  </Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
            </Menu>
          </Sider>

          <Layout>
          <Content style={{ padding: 100, marginTop: -95, minHeight: 750 }}>
          
              <div className="site-layout-background" style={{ padding: 24, maxHeight: 450 }}>
                <Map center={[-37.788, 144.951]} zoom={12} scrollWheelZoom={false} style = {{height:'100vh', width:'157vh'}}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                    <LayersControl position="topright">
                      <LayersControl.Overlay name="suburb boundary">
                        <GeoJSON data={bar} />
                      </LayersControl.Overlay>
                      { available(lanTest) && available(moodTest) && (suburbInfos.map((info) => (generateLayer(info)))) }
                    </LayersControl>
                </Map>
              </div>
      
          </Content>
            <Footer style={{ textAlign: 'center' }}>CCC assignment2 group 11</Footer>
          </Layout>
                      
        </Layout>
      </Layout>
    </div>
  )
}

export default HomePage