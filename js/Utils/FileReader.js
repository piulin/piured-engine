/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured-engine <https://github.com/piulin/piured-engine>.
 #
 # piured-engine is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured-engine is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured-engine.If not, see <http://www.gnu.org/licenses/>.
 *
 */

export default async function readFileContent (pathToFile, callbackFunction) {

    let response = await fetch(pathToFile, {method: 'GET', mode: 'cors'})
    let content = await response.text()
    callbackFunction(content)
    // fetch(pathToFile, {method: 'GET', mode: 'cors'}).then( res => res.text())
    //     .then(content => {
    //         callbackFunction(content)
    //     }).catch((reason => {
    //         console.log(reason)
    // }))
    // $.ajax(
    //     {
    //         url: pathToFile,
    //         method: 'GET',
    //         success: callbackFunction,
    //         crossDomain: true,
    //         async: false
    //     }
    // ) ;

}

