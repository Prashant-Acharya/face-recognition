import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'
import './App.css';
	const app = new Clarifai.App({
		apiKey: '7013331737ca47ecb456b06efd80e9da'
	})

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageURL: '',
			box: {}
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = 500
		const height = Number(image.height)
		console.log(height, width)
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		this.setState({box: box});
	}

	onInputChange = event => {
		this.setState({input: event.target.value})
	}

	handleSubmit = () => {
		this.setState({imageURL: this.state.input})
		app.models.predict("a403429f2ddf4b49b307e318f00e528b", this.state.input)
			.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
			.catch(err => { console.log(err) })
	}
 
	render() {
		const particlesOptions = {
			particles: {
				number: {
					value: 100,
					density: {
						enable: true,
						value_area: 800
					} 
				}
			},
			interactivity: {
				detect_on: 'window',
				events: {
					onhover: {
						enable: true,
						mode: 'grab'
					}
				}
			}
		}
		return (
			<div className="App">
				<Particles 
					params = {particlesOptions} 
					className = 'particles'
				/>
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm 
					onInputChange = {this.onInputChange}
					handleSubmit = {this.handleSubmit}	
				/>
				<FaceRecognition box = {this.state.box} imageURL = {this.state.imageURL}/>
			</div>
		);
	}
}

export default App;
