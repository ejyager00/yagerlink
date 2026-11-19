;; Dev environment for yagerlink. Hugo comes from nonguix.
;; Usage (FHS container needed for workerd / npm prebuilt binaries):
;;   guix shell -m manifest.scm --container --emulate-fhs --network -- <cmd>
(specifications->manifest
 '("hugo"
   "node"
   "git"
   "bash"
   "coreutils"
   "grep"
   "sed"
   "gawk"
   "findutils"
   "curl"
   "nss-certs"))
