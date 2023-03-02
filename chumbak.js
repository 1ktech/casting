//sender
const getTemplate = async (url, key)=>{
    //handle view on screen with key
    const resp = await fetch(url);
    //get image url to be passed on to getPresentationRequest
    return resp.data;
}

const startPresentation = (presentationRequest)=>{
    navigator.presentation.defaultRequest = presentationRequest;

    let presentationConnection;
    presentationRequest.start().then(connection => {
        console.log('connection started', connection.id);
    })
    .catch(error => {
        console.log('error', error.name, error.message);
    })

    presentationRequest.addEventListener('connectionavailable', (event)=>{
        presentationConnection = event.connection;
        presentationConnection.addEventListener('close', ()=>{
            console.log('closed');
        })

        presentationConnection.addEventListener('terminate', ()=>{
            console.log('terminated');
        })

        presentationConnection.addEventListener('message', (event)=>{
            console.log('message', event.data);
        })
    })
    return presentationConnection;
}

const getPresentationRequest = (url)=>{
    // if (window.screen.isExtended) {
    //     // Request information required to place content on specific screens.
    //     const screenDetails = await window.getScreenDetails();
      
    //     // Detect when a screen is added or removed.
    //     screenDetails.addEventListener('screenschange', onScreensChange);
      
    //     // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
    //     screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);
      
    //     // Find the primary screen, show some content fullscreen there.
    //     const primaryScreen = screenDetails.screens.find(s => s.isPrimary);
        
    //     //to get screen it is in screenDetails.screens
    //     console.log(screenDetails.screens) 
    const presentationRequest = new PresentationRequest(url);
    presentationRequest.getAvailability().then(availability => {
        console.log(availability.value, 'available');
    }).catch(console.log("error"))
    return presentationRequest;
} 

const closePresentation = (presentationConnection)=>{
    presentationConnection.send(null);
}

// const terminatePresentation = ()=>{
//     presentationConnection.send(template);
// }

//send template to presentation
const displayContent = (presentationConnection)=>{
    presentationConnection.send(template);
}

//receiver page

const displayHandler = ()=>{
    document.addEventListener('DOMContentLoaded', ()=>{
        if(navigator.presentation.receiver){
            navigator.presentation.receiver.connectionList.then(list=>{
                list.connections.map(connection => ()=>{
                    connection.addEventListener('message', (event)=>{
                        console.log(event.data);
                        document.querySelector('#root').innerHTML = event.data;
                    })
                })
                list.addEventListener('connectionavailable', (event)=>{
                    event.connection.addEventListener('message', (e)=>{
                        console.log(e.data);
                        document.querySelector('#root').innerHTML = e.data;
                    })
                })
            })
        }
    })
}

export {
    getTemplate,
    startPresentation,
    getPresentationRequest,
    displayHandler,
    displayContent,
    closePresentation,
}                               