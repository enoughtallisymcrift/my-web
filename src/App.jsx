import 'antd/dist/antd.css'
import { Route, Routes } from 'react-router-dom'
import About from './views/About'
import Blog from './views/Blog'
import Home from './views/Home'
import Layout from './views/Layout'
import Login from './views/Login'
import Tictactoe from './views/Tictactoe'
import Todos from './views/Todos'

function App() {
    return (
        <div className='app'>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/blog' element={<Blog />} />
                    <Route path='/todos' element={<Todos />} />
                    <Route path='/tictactoe' element={<Tictactoe />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/login' element={<Login />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
