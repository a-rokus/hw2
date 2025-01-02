function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.

	const studentsRow = document.getElementById("students");
	studentsRow.innerHTML = ''; // Clear prev student cards

	for (let elem of studs) {
		// first & last name
		const studentNode = document.createElement("div");
		// 4. Responsive Design
		studentNode.className = "col-12 col-md-6 col-lg-4 col-xl-3";

		const nameNode = document.createElement("h1");
		nameNode.innerText = elem.name.first + " " + elem.name.last;
		studentNode.appendChild(nameNode);

		// major
		const majorNode = document.createElement("p");
		majorNode.innerText = elem.major;
		studentNode.appendChild(majorNode);

		// number of credits & from WI
		const creditsNode = document.createElement("p");
		creditsNode.innerText = elem.fromWisconsin ? (elem.name.first + " is taking " + elem.numCredits + " credits and is from Wisconsin.") :
			(elem.name.first + " is taking " + elem.numCredits + " credits and is NOT from Wisconsin.");
		creditsNode.style.fontWeight = "normal";
		studentNode.appendChild(creditsNode);

		// interests
		const interestsNode = document.createElement("ul");
		interestsNode.innerText = "They have " + elem.interests.length + " interests including...";
		interestsNode.style.fontWeight = "normal";
		interestsNode.style.padding = "0";
		studentNode.appendChild(interestsNode);
		for (let interest of elem.interests) {
			const newInterest = document.createElement("li");
			newInterest.innerText = interest;
			newInterest.style.fontWeight = "normal";

			// 6. Similar Interests
			// Search for all students with interest when clicked
			newInterest.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;
				document.getElementById("search-name").value = ''; // use value (not innerText) to update inputs
				document.getElementById("search-major").value = '';
				document.getElementById("search-interest").value = selectedText;
				handleSearch(e);
			})
			studentNode.appendChild(newInterest);
		}

		studentsRow.appendChild(studentNode);
	}

}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// TODO Implement the search
	// 5. Search Functionality

	// case-insensitive
	const searchName = document.getElementById("search-name").value.trim().toLowerCase();
	const searchMajor = document.getElementById("search-major").value.trim().toLowerCase();
	const searchInterest = document.getElementById("search-interest").value.trim().toLowerCase();

	const filteredStudents = students.filter(student => {
		const fullName = (student.name.first + " " + student.name.last).toLowerCase()

		// always include term if not searched by its field
		const nameMatch = searchName ? fullName.includes(searchName) : true;
		const majorMatch = searchMajor ? student.major.toLowerCase().includes(searchMajor) : true;
		const interestMatch = searchInterest ? student.interests.some(interest => interest.toLowerCase().includes(searchInterest)) : true;

		return nameMatch && majorMatch && interestMatch;
	})

	// update num-results
	const numResults = document.getElementById("num-results");
	numResults.innerText = filteredStudents.length;

	// update displayed students
	buildStudents(filteredStudents);

}

let students = [];

// 1. Fetching data
fetch('https://cs571api.cs.wisc.edu/rest/f24/hw2/students', {
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})
	.then(response => response.json())
	.then(data => {
		console.log(data);

		// 2. Show # of students
		const numStudents = document.getElementById("num-results");
		numStudents.innerText = data.length;

		// 3. Displaying Students
		students = data;
		buildStudents(students);
	})
	.catch(error => console.error(error))

document.getElementById("search-btn").addEventListener("click", handleSearch);