---

## 📂 Repository Structure (Technical Inventory)

Here is the exact location of the source code within this project:

### 🔹 Apex Classes (Backend)
* **Controller:** [`force-app/main/default/classes/EngagementController.cls`](force-app/main/default/classes/EngagementController.cls)
    * *Handles SOQL queries for task counting and task creation logic.*

### 🔹 Lightning Web Components (Frontend)
* **Component Bundle:** [`force-app/main/default/lwc/engagementSummary/`](force-app/main/default/lwc/engagementSummary/)
    * [`engagementSummary.html`](force-app/main/default/lwc/engagementSummary/engagementSummary.html): *UI Structure.*
    * [`engagementSummary.js`](force-app/main/default/lwc/engagementSummary/engagementSummary.js): *Client-side logic (LDS & Apex calls).*

### 🔹 Custom Metadata & Objects
* **Object Definition:** [`force-app/main/default/objects/Engagement__c/`](force-app/main/default/objects/Engagement__c/)
* **Tab Definition:** `force-app/main/default/tabs/Engagement__c.tab-meta.xml`

---