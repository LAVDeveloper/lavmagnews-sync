https://github.com/fixthestatusquo/proca-server/tree/main/service

•	client.ts - one file to talk to the CRM API
•	contact.ts -one file to create a required CRM record, taking some options
•	index.ts - run a loop of syncQueue() callbacks that do the action/member upsert (depending on how your CRM works, it would check the target list, check if member exists and update or create new.
The syncQueue comes from @proca/queue npm package and can do rate limiting using prefetch option, and automatic data decryption (if you use encryption) when keyStore is given (loaded with utils in @proca/crypto package).
