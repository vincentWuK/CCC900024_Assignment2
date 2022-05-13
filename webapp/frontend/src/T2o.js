import React, { useState } from 'react';
import Axios from 'axios';
import { Layout, Typography, Space, Menu, DatePicker, Button } from 'antd';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { MapContainer as Map, TileLayer, Marker, Popup, LayersControl, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Chart from 'react-google-charts';
import { available } from './Util';
import { request_sent_city } from './FetchData';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function T2o() {

  let navigate = useNavigate();

  const [t2oDate, setT2oDate] = useState({from_date:'', to_date:''});

  function onChange(t2oDates, t2oDateStrings) {
    const newT2oDates = {...t2oDates}
    newT2oDates['from_date'] = t2oDateStrings[0]
    newT2oDates['to_date'] = t2oDateStrings[1]
    setT2oDate(newT2oDates)
  }
  
  function submit(e) {
    request_sent_city(t2oDate).then((response) => setMoodCityTest(response))
  }


  const [moodCityTest, setMoodCityTest] = useState({})

  function toT2oList(cityMood) {
    var table = [["mood", "ratio"]]
    const moods = Object.keys(cityMood)
    for (const i in moods) {
      table.push([moods[i], cityMood[moods[i]]])
    }
    return table
  }

  const [cityInfos, setCityInfos] = useState([
    {
      show: false,
      name: 'Adelaide' ,
      cord: [-34.921230,  138.599503],
      code: 'adelaide',
      title: 'Adelaide Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Brisbane' ,
      cord: [-27.470125, 153.021072],
      code: 'brisbane',
      title: 'Brisbane Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Sydney' ,
      cord: [-33.521144, 151.122983],
      code: 'sydney',
      title: 'Sydney Analysis within Given Time Period',
    },
    {
      show: false,
      name: 'Melbourne' ,
      cord: [-37.840935, 144.946457],
      code: 'melbourne',
      title: 'Melbourne Analysis within Given Time Period',
    }
  ])

  function setInfoShow (code, value) {
    const infoCopy = [...cityInfos]
    for (const i in infoCopy) {
      if (infoCopy[i].code === code ) {
        infoCopy[i].show = value
        break
      }
    }
    setCityInfos (infoCopy)
  }

  function generateLayer (info) {
    return (
      <LayersControl.Overlay name= {info.name}>
        <Marker position={info.cord}>
          <Popup>
            <Button type="primary" onClick={() => setInfoShow(info.code,true)}>
              More Details
            </Button> 
            <Modal show={info.show} onHide={() => setInfoShow(info.code,false)}>
              <Modal.Header closeButton>
                <Modal.Title>{info.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                { available(moodCityTest) && Object.keys(moodCityTest).includes(info.code) &&
                    (<Chart
                    chartType="PieChart"
                    data={toT2oList(moodCityTest[info.code])}
                    width="450px"
                    height="250px"
                    legendToggle
                    options={{
                      title: 'Moods Analysis',
                      pieHole: 0.3,
                    }}
                  />)
                  }                          
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
    <div className='T2o'>
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

              <SubMenu title = {<span>Topic 2: Unemployment Overview</span>}>


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
                  <Button onClick={submit} type='primary' style={{marginLeft: "40%"}}>Submit</Button>

              </SubMenu>

              <SubMenu title = {<span>Topic Plot Analysis</span>}>

                <Menu.ItemGroup>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "35px"}} onClick={() => {navigate('/') }}>
                      -- HomePage --
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "10px"}} onClick={() => {navigate('/T1_GA') }}>
                      Topic 1 Graph Analysis
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
            <Content style={{ padding: 100, marginTop: -95, minHeight: 750 }}>
              
                {/* for example australia melbourne */}
                <div className="site-layout-background" style={{ padding: 24, maxHeight: 450 }}>
                  <Map center={[-28.0948, 147.0100]} zoom={5} scrollWheelZoom={false} style = {{height:'100vh', width:'157vh'}}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* central coordinate of canberra position = [-35.282001, 149.128998] */}

                    <LayersControl position="topright">
                      
                      {available(moodCityTest) && cityInfos.map((info) => (generateLayer(info))) }

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

export default T2o